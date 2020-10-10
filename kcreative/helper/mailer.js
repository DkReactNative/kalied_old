var fs = require("fs");
var globals = require('../config/app');

/* Node Mailer Work Start */
var nodemailer = require('nodemailer');
// async..await is not allowed in global scope, must use a wrapper
const mailSend = async function(data) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let emailAccount = {
            name: globals.emailName,
            email: globals.emailEmail,
            password: globals.emailPassword
        };
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailAccount.email,
                pass: emailAccount.password
            }
        });
        let email_content
        email_template_path = __dirname + "/../public/email_template/emails.html";
        fs.readFile(email_template_path, { encoding: 'utf-8' }, function(err, html) {
            if (err) {
                email_content = data.html;
            } else {
                email_content = html
                    /* if (typeof (data.message_keys) != undefined) {
                      for (let keys in data.message_keys) {
                        email_content = email_content.replace("{" + keys + "}", data.message_keys[keys]);
                      }
                    } else {
                      email_content = email_content.replace("{msg}", data.html);
                    }*/
                email_content = email_content.replace("{msg}", data.html);
            }
            var mailOptions = {
                from: emailAccount.name + emailAccount.email,
                to: data.email,
                subject: data.subject,
                html: email_content
                    // html: data.html
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                    return false
                } else {
                    console.log('Email sent: ' + info.response);
                    return true
                }
            });
        });
    }
    /* Node Mailer Work End */

module.exports = mailSend;