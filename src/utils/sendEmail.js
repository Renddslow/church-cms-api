const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

const mediator = require('../utils/mediator');

const sendEmail = () =>
  mediator.provide('sendEmail', async (subject, message, to, from) => {
    return sgMail
      .send({
        html: message,
        to,
        from: from.email,
        subject,
      })
      .catch((e) => console.log(e.response.body));
  });

module.exports = sendEmail;
