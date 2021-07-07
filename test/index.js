/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

const logger = require('../index')({
  levels: {
    log: {
      format: '&b[&aINFO&b]&r', writeToLogFile: true, sendMail: false
    },
    error: { format: '&b[&cERROR&b]&r', writeToLogFile: true, sendMail: true },
  },
  mail: {
    from: "NodeJs Logger <info@lorenzovaccher.com>",
    subject: "HELP!",
    to: ["lorenzovaccher001@gmail.com"],
    host: "pro2.mail.ovh.net",
    port: 587,
    secure: false,
    pool: false,
    auth: {
      user: "info@lorenzovaccher.com",
      password: "***********"
    }
  }
});

logger.clearConsole();
logger.log('&bHi! &bthis is a &b%text%', 'database', { text: 'test!' });
logger.warn('Hi! this is a warn! :(', 'website');
logger.debug('Dubug, deug, debug, only DEBUG!');
logger.log('&aTEST&r&aTestTest!!!!&basdasd&basdasd&bsd');
logger.log({test: "Hi!", pippo: 0, lolo: true});
