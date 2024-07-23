const { sendMessage } = require('../utils/clients/twillioClient');
const { logger } = require('../utils/logger');

const sendSMS = async (smsBody, receiverNumber) => {
  try {
    const response = await sendMessage(smsBody, receiverNumber);
    logger.info('SMS sent succesfully');
    return response;
  } catch (err) {
    logger.error(err, `Error occured while trying to send SMS!`);
    throw err;
  }
};

module.exports = {
  sendSMS,
};
