const nodemailer = require('@nodemailer/pro');

let transporter;


/**
 * let mailOptions = {
 *  from: '"Ola Nordmann" <ola.nordmann96@norge.no>',
 *  to: 'chriba.nordmann@chriba.no',
 *  subject: 'Test av mail server',
 *  text: 'Noke blank tekst',
 *  html: '<h2>Bedre tekst her!</h2>'
 * };
 *
 * */
function init(config) {
    return new Promise((rsv, rr) => {
        transporter = nodemailer.createTransport(config);

        transporter.verify((err, success) => {
            if (err) {
                console.error(err);
                return rr(err);
            }

            rsv(success);
        })
    })
}

function send(options, html) {
    return new Promise((rsv, rr) => {
        if (!transporter) {
            return rr(new Error('[Email] init() must be called before send'));
        }

        const { from, to, subject} = options;
        const opt = { from, to, subject, html };

        transporter.sendMail(opt, (err, info) => {
            if (err) {
                return rr(err);
            }

            rsv(info);
        });
    });
}

module.exports = { init, send };