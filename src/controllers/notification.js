const { sendMessage } = require('../utils/clients/twillioClient');
const { logger } = require('../utils/logger')

const sendSMS = async (smsBody, receiverNumber) => {
    try {
        const response = await sendMessage(smsBody, receiverNumber);
        logger.info("SMS sent succesfully");
        return response;
    } catch (err) {
        logger.error(err, `Error occured while trying to send SMS!`);
        throw err;
    }
};

const processMessage = async (type, data) => {
    try {
        if (type === "SMS") {
            const { body, receiverNumber } = data;
            return await sendSMS(body, receiverNumber);
        }
    } catch (err) {
        logger.error(err, `Error occured while processing message!`);
        throw err;
    }
}

module.exports = {
    sendSMS,
    processMessage
}