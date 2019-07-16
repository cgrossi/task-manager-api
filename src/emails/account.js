const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'cgrossi@gmail.com',
    subject: 'Welcome to the club',
    text: `Hi there ${name}. Thanks for joing this site`
  })
}

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'cgrossi@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Hi ${name}, we just wanted to follow up and see if there was anything we could do to improve our service before you go`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}