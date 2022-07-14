/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

import { createTransport } from 'nodemailer';
import { renderFile } from 'ejs';

/**
 * This function is used to send emails to other users.
 * 
 * @param {*} template Email's template
 * @param {*} options data used to send the email and some arguments that needs to be rendered in the template eventually.
 */
export default function send(template, options) {
  // Creation of the path for the file
  const _MAIN_PATH = process.cwd().replace('file://', '');
  let rootPath = _MAIN_PATH;

  if (template.split("")[0] != "/")
    rootPath += ("/" + template);
  else
    rootPath += (template);

  let transporter = createTransport({
    host: options.host,
    port: options.port,
    secure: options.secure,
    pool: options.pool,
    maxConnections: 1,
    auth: {
      user: options.auth.user,
      pass: options.auth.password
    }
  });

  /**
   * Function used to send the email to the users
   * indicated in the form initialization settings.
   * 
   * @param {String} dataFile html to send
   */
  let sender = (dataFile) => {
    for (var i = 0; i < options.to.length; i++) {
      transporter.sendMail({
        from: options.from,
        to: options.to[i],
        subject: options.subject,
        html: dataFile
      }, function (error, info) {
        if (error) {
          console.error(error);
        }
      });
    }
  };

  // Reading of the template that needs to be sent. If this is not found, a default template will be used.
  renderFile(rootPath, { data: options.data }, function (error, dataFile) {
      if (error) {
        console.trace("The indicated template could not be loaded. An email was sent with the default template.");
        renderFile("./lib/modules/email/views/defaultEmail.ejs", { data: options.data }, function (errorTwo, dataFileTwo) {
          if (errorTwo) {
            console.error(errorTwo);
          } else {
            sender(dataFileTwo);
          }
        });
      } else {
        sender(dataFile);
      }
    });
}