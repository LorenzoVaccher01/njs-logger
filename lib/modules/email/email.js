/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

const nodemailer = require('nodemailer');
const ejs = require('ejs');

/**
 * This function is used to send emails to other users.
 * 
 * @param {*} template Email's template
 * @param {*} options data used to send the email and some arguments that needs to be rendered in the template eventually.
 */
exports.send = function (template, options) {
  // Creazione del path per il file
  const _MAIN_PATH = require.main.filename.split('/');
  _MAIN_PATH.pop();

  let rootPath = _MAIN_PATH.join('/');

  if (template.split("")[0] != "/")
    rootPath += ("/" + template);
  else
    rootPath += (template);

  let transporter = nodemailer.createTransport({
    host: options.host,
    port: options.port,
    secure: options.secure,
    pool: options.pool,
    auth: {
      user: options.auth.user,
      pass: options.auth.password
    }
  });

  /**
   * Funzione utilizzata per inviare la email agli utenti
   * indicati nelle impostazione di inizializzazione del
   * modulo
   * 
   * @param {String} dataFile html to send
   */
  let sender = (dataFile) => {
    for (var i = 0; i < options.to.length; i++) {
      console.log(options.to[i]);
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

  //Lettura del template da inviare. Se questo non viene trovato, verrà utilizzato
  //un template di default.
  ejs.renderFile(rootPath, { data: options.data }, function (error, dataFile) {
      if (error) {
        console.trace("The indicated template could not be loaded. An email was sent with the default template.");
        ejs.renderFile("./lib/modules/email/views/defaultEmail.ejs", { data: options.data }, function (errorTwo, dataFileTwo) {
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
};