const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'patchfact@gmail.com',
        subject: 'Welcome to my Task Manager API!',
        text: `Hello ${name}! Welcome to my Task Manager App. I hope you enjoy it.`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'patchfact@gmail.com',
        subject: 'We are sad to see you go :(',
        text: `Hey ${name}, we are sorry to see you leave. Could you take a moment to tell us what we could've done better?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}