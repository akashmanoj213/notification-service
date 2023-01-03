const express = require('express');
const { sendSMS } = require('../../controllers/notification');
const { success, error } = require('./util');

const router = express.Router();

router.post('/sms', async (req, res) => {
    try {
        const { body, receiverNumber } = req.body
        req.log.info(`Sending SMS to ${receiverNumber}`);

        const response = await sendSMS(body, receiverNumber);
        res.status(200).json(success(res.statusCode, "SMS sent succesffully", response));
    } catch (err) {
        req.log.error(err, 'Error occured in /sms');
        return res.status(500).json(error(res.statusCode, err.message));
    }
})

module.exports = router;