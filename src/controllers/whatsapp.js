const { logger } = require('../utils/logger');
const TextMessage = require('../models/whatsapp/TextMessage');
const ClaimCreatedTemplate = require('../models/whatsapp/templates/ClaimCreatedTemplate');
const { post } = require('../utils/clients/axiosClient');

// EAAGEkpu5T3ABOZC2cu8Yca8nF5nDCeyB6Sa20FNcmFkOVff1bVxZC4bDgZC2rTMiEu0db56DM6UrFB3iprg45ax8YUKqmFi4X7j1NfcZAQ0GziKJthBGZAzw4VlQL7CvvoKE48BJeBlCDipVhATlaKZBrbwK9tcYyBrW3MkMVZAwpjWEF8D6ZBieD0wswA7n1Cm6jWAdffZCWCO6dZCCvtI0Qbp5KVJD6gpZCRzZAL0ZD
const BEARER_TOKEN = process.env.BEARER_TOKEN;

const sendMessage = async (data) => {
  const { type, receiverNumber } = data;

  const request = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: receiverNumber,
  };

  switch (type) {
    case 'text': {
      const { body, previewUrl } = data;
      const messageObj = new TextMessage(body, previewUrl);
      request['type'] = 'text';
      request['text'] = messageObj;
      break;
    }
    case 'template': {
      const messageObj = getTemplateMessageObj(data);
      request['type'] = 'template';
      request['template'] = messageObj;
      break;
    }
  }

  //Call whatsapp API
  logger.info('The constructed request:', request);
  try {
    const response = await post(
      'https://graph.facebook.com/v20.0/102719322589708/messages',
      request,
      {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
      }
    );

    logger.info('Whatsapp API response :', response);
    return response;
  } catch (err) {
    logger.error(
      err,
      `Error occured while sending request to Whatsapp API: ${err.message}`
    );
    throw err;
  }
};

const getTemplateMessageObj = (data) => {
  const { name } = data;
  switch (name) {
    case 'customer_claim_raised':
      return new ClaimCreatedTemplate(data);
  }
};

module.exports = {
  sendMessage,
};
