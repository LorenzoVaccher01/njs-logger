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
   * Funzione utilizzata per zippare tutte le cartelle dei log.
   * Tale funzione viene eseguita ogni primo giorno del mese alle 5 del mattino.
   *  
   * Ogni primo del mese in quanto verranno zippate soltanto le cartelle dei mesi 
   * e degli anni, non i singoli file che rappresentano i giorni del mese.
   */
  runFolderZipper: (path, months) => {
    schedule.scheduleJob('0 0 5 1 * *', () => {
      require('./zipper').folderZipper(path, months);
    });
  }
}