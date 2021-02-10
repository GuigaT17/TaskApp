const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'guigateixeira17@gmail.com',
        subject: 'Welcome to the Task App',
        text: 'Welcome to the app, ' + name + '. How do you like the app so far?'
    });
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'guigateixeira17@gmail.com',
        subject: 'Goodbye from the Task App',
        text: 'We are sad to see you go, ' + name + '. Any recomendations to make the app better?'
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}