/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

import { scheduleJob } from 'node-schedule';
import zipper from './zipper.js';

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

export default function(path, months) {
  scheduleJob('0 0 5 1 * *', () => {
    zipper(path, months);
  });
}