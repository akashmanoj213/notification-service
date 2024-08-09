const { sendMessage } = require('../utils/clients/twillioClient');
const { logger } = require('../utils/logger');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

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



async function sendEmail(subject, to,bcc, cc, templateName,  templateParams, attachmentsBase64) {

    // Send the email
    try {
      let smtpHost = process.env.SMTP_HOST
      let smtpPort = process.env.SMTP_PORT
      let senderAddress=  process.env.SENDER_ADDRESS

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false, 
        // host: 'smtp.gmail.com',
        // port: 587,
        // auth:{
        //   user:"vnshtiwari7@gmail.com",
        //   pass:"nxxxxxxx"
        // }
    });

    // Load the email template
    const templatePath = path.join(__dirname, '../resource/email_template.ejs');
    const template = fs.readFileSync(templatePath, 'utf-8');

    let emailBody=null;
    if(templateName == 'basic'){
      let  {name, message} = templateParams
      emailBody = ejs.render(template, { name, message });
    }


    // Define email options
    const mailOptions = {
        from: senderAddress,
        to: to,
        bcc:bcc,
        cc:cc,
        subject: subject,
        html: emailBody,
    };

    // Attach a file if it exists
    if (attachmentsBase64) {
        mailOptions.attachments = 
        attachmentsBase64.map((file)=> {
            return {
              "filename":file.name,
              "content": file.base64,
              "encoding": 'base64'
          }
          });
    }
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return info.response
    } catch (error) {
        console.error(`Failed to send email: ${error}`);
    }
}




module.exports = {
  sendSMS,
  sendEmail
};
