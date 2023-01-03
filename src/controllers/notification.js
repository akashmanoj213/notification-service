const { sendMessage } = require('../services/twillioClient');

const sendSMS = async (smsBody, receiverNumber) => {
    const response = await sendMessage(smsBody, receiverNumber);
    return response;
};

module.exports = {
    sendSMS
}