const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const senderNumber = process.env.TWILIO_SENDER_NUMBER;

console.log("token:", process.env.TWILIO_AUTH_TOKEN);

const client = require('twilio')(accountSid, authToken);

const sampleMessage = "This is a test SMS from notification service."

const sendMessage = async (body = sampleMessage, receiverNumber) => {
    const response = await client.messages
        .create({
            body, // 'This is the ship that made the Kessel Run in fourteen parsecs?',
            from: senderNumber,
            to: "+919972976940" // Trial allows sending SMS to only this number
        });

    return response;
};

module.exports = {
    sendMessage
}