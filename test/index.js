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
    error: { format: '&b[&cERROR&b]&r', writeToLogFile: true, sendMail: false },
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
logger.log('&cW&ao&ew&r, &5i &bl&co&fv&be &r&zNode.js!');
logger.error('This is an &nerror&r! &c:(', 'email');
logger.log({field: "IT", name: "Lorenzo", admin: true});
logger.log(logger.COLOR.RED + "You can also invoke colors with \"logger.COLOR.{color}\"");

logger.log(logger.COLOR.RED + "ciao " + logger.COLOR.BRIGHT_RED + "ciao");
