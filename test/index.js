/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/
import log from '../index.js';
const settings = {
  levels: {
    log: {
      format: '&c[&gINFO&c]&res', writeToLogFile: true, sendMail: false
    },
    error: { format: '&c[&rERROR&c]&res', writeToLogFile: true, sendMail: false },
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
};

const logger = log(settings);

logger.clearConsole();
logger.debug("test");
logger.log('&cHi! this is a &m%text%', 'database', { text: 'test!' });
logger.warn('Hi! this is a warn! :(', 'website');
logger.log('&rW&go&yw&res, &mi &cl&ro&wv&ce &res&bliNode.js!');
logger.error('This is an &underror&res! &r:(', 'email');
logger.log({field: "IT", name: "Lorenzo", admin: true});
logger.debug(["wow!", {user: "n91jasd", role: "user"}, true, 10.04]);
logger.log(logger.COLOR.RED + "You can also invoke colors with \"logger.COLOR.{color}\"");
logger.log(logger.COLOR.RED + "Hi &b-mhi &revtest");

let startTime = logger.startTime();

setTimeout(() => {
  let endTime = logger.endTime(startTime);
  let endTime1 = logger.endTime(startTime, 4);
  let endTime2 = logger.endTime(startTime, 'm');
  let endTime3 = logger.endTime(startTime, 'h', 1);

  console.log("Execution time: " + endTime + " milliseconds");
  console.log("Execution time: " + endTime1 + " milliseconds");
  console.log("Execution time: " + endTime2 + " minutes");
  console.log("Execution time: " + endTime3 + " hours");
}, 150);