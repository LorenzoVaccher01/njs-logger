/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

const schedule = require('node-schedule');

// The cron format consists of:
//
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week(0 - 7)(0 or 7 is Sun)
// │    │    │    │    └───── month(1 - 12)
// │    │    │    └────────── day of month(1 - 31)
// │    │    └─────────────── hour(0 - 23)
// │    └──────────────────── minute(0 - 59)
// └───────────────────────── second(0 - 59, OPTIONAL)

module.exports = {

  /**
   * Function used to zip all log folders. This function is performed the first day of every month at 5 am.
   */
  runFolderZipper: (path, months) => {
    schedule.scheduleJob('0 0 5 1 * *', () => {
      require('./zipper').folderZipper(path, months);
    });
  }
}