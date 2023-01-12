const express = require('express');
const { sendSMS, processMessage } = require('../../controllers/notification');
const { formatMessageData } = require('../../utils/clients/pubSubClient');
const { success, error } = require('./util');

const router = express.Router();

router.post('/consumer', async (req, res) => {
    try {
        if (!(req.body && req.body.message && req.body.message.data && req.body.message.attributes)) {
            throw new Error("Malformed message received!");
        }
        const { body: { message: { data, attributes: { type }, messageId }} } = req;

        req.log.info({ body: req.body }, `Consuming message...${messageId}`);
        const jsonObj = formatMessageData(data);

        const result = await processMessage(type, jsonObj);
        
        res.status(200).json(success(res.statusCode, `MessageId: ${messageId} processed successfully`, result));
    } catch (err) {
        req.log.error(err, 'Error occured in /consumer');
        return res.status(500).json(error(res.statusCode, err.message));
    }
});

router.post('/sms', async (req, res) => {
    try {
        const { body, receiverNumber } = req.body;
        req.log.info(`Sending SMS to ${receiverNumber}`);

        const response = await sendSMS(body, receiverNumber);
        res.status(200).json(success(res.statusCode, "SMS sent succesffully", response));
    } catch (err) {
        req.log.error(err, 'Error occured in /sms');
        return res.status(500).json(error(res.statusCode, err.message));
    }
})

module.exports = router;