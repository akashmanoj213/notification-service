const express = require('express');
const { sendSMS } = require('../../controllers/notification');
const { sendMessage } = require('../../controllers/whatsapp');
const { formatMessageData } = require('../../utils/clients/pubSubClient');
const { success, error, validation } = require('./util');
const textMessageSchema = require('../../models/schema/textMessage');
const claimCreatedSchema = require('../../models/schema/claimCreatedTemplate');

const router = express.Router();

router.post('/consumer', async (req, res) => {
  try {
    if (
      !(
        req.body &&
        req.body.message &&
        req.body.message.data &&
        req.body.message.attributes
      )
    ) {
      throw new Error('Malformed message received!');
    }
    const {
      body: {
        message: {
          data,
          attributes: { type },
          messageId,
        },
      },
    } = req;

    req.log.info({ body: req.body }, `Consuming message...${messageId}`);
    const jsonObj = formatMessageData(data);

    const result = await processMessage(type, jsonObj);

    res
      .status(200)
      .json(
        success(
          res.statusCode,
          `MessageId: ${messageId} processed successfully`,
          result
        )
      );
  } catch (err) {
    req.log.error(err, 'Error occured in /consumer');
    return res.status(500).json(error(res.statusCode, err.message));
  }
});

const processMessage = async (type, data) => {
  try {
    if (type === 'SMS') {
      const { body, receiverNumber } = data;
      return await sendSMS(body, receiverNumber);
    } else if (type === 'whatsapp') {
      return await sendWhatsappMessage(data);
    }
  } catch (err) {
    logger.error(err, `Error occured while processing message!`);
    throw err;
  }
};

//type, name, receiverNumber with +91, body, claimId, claimType, patientFullName, caretakerContactNumber, totalClaimAmount
const sendWhatsappMessage = async (data) => {
  try {
    const { type, name, receiverNumber } = data;
    if (!receiverNumber || receiverNumber.length !== 12) {
      throw new Error(
        'receiverNumber must be a valid 10 digit string with country code !'
      );
    }
    if (!type) {
      throw new Error('type is required');
    } else if (type === 'template' && !name) {
      throw new Error('name is required');
    }

    const validationError = validateRequest(data);

    if (validationError) {
      throw new Error(
        'Error occured during request validation: ',
        validationError
      );
    }

    return await sendMessage(data);
  } catch (err) {
    logger.error(err, `Error occured in sendWhatsappMessage : ${err.message}`);
    throw err;
  }
};

router.post('/sms', async (req, res) => {
  try {
    const { body, receiverNumber } = req.body;
    req.log.info(`Sending SMS to ${receiverNumber}`);

    const response = await sendSMS(body, receiverNumber);
    res
      .status(200)
      .json(success(res.statusCode, 'SMS sent succesffully', response));
  } catch (err) {
    req.log.error(err, 'Error occured in /sms');
    return res.status(500).json(error(res.statusCode, err.message));
  }
});

// type, name, phoneNumber with +91, body, claimId, claimType, patientFullName, caretakerContactNumber, totalClaimAmount
router.post('/whatsapp', async (req, res) => {
  const { type, name, receiverNumber } = req.body;

  if (!receiverNumber || receiverNumber.length !== 12) {
    return res
      .status(400)
      .json(
        error(
          'phoneNumber must be a valid 10 digit string with country code !',
          res.statusCode
        )
      );
  }
  if (!type) {
    return res.status(400).json(error('type is required', res.statusCode));
  } else if (type === 'template' && !name) {
    return res.status(400).json(error('name is required', res.statusCode));
  }

  try {
    const validationError = validateRequest(req.body);

    if (validationError) {
      req.log.error(
        'Error occured during request validation: ',
        validationError
      );
      return res
        .status(422)
        .json(validation(validationError.message, validationError));
    }

    const response = await sendMessage(req.body);

    return res
      .status(200)
      .json(success('Message sent successfully', response, res.statusCode));
  } catch (err) {
    req.log.error(err, `Error occured in /whatsapp : ${err.message}`);
    return res.status(500).json(validation(err.message, err));
  }
});

router.post('/webhook', (req, res) => {
  let body = req.body;

  // Check the Incoming webhook message
  console.log('Whatsapp webhook ping: ', JSON.stringify(body, null, 2));
});

router.get('/webhook', (req, res) => {
  //This will be the Verify Token value when you set up webhook
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      req.log.info('Whatsapp - WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

const validateRequest = (body) => {
  const { type } = body;
  let validationError = null;

  switch (type) {
    case 'text':
      validationError = textMessageSchema.validate(body).error;
      break;
    case 'template':
      validationError = validateTemplateSchema(body);
      break;
    default:
      throw new Error(`Type - ${type} does not exist !`);
  }

  return validationError;
};

const validateTemplateSchema = (body) => {
  const { name } = body;

  switch (name) {
    case 'customer_claim_raised':
      return claimCreatedSchema.validate(body).error;
    default:
      throw new Error(`Template name - ${name} does not exist !`);
  }
};

module.exports = router;
