/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

import { existsSync, mkdirSync, appendFile } from 'fs';
import email from './modules/email/email.js';

/**
 * Colors code, used for the console coloring.
 */
const _COLOR = {
  RESET: '\x1b[0m',
  HIDDEN: '\x1b[8m',
  REVERSE: '\x1b[7m',
  BLINK: '\x1b[5m',
  UNDERLINE: '\x1b[4m',

  BRIGHT_BLACK: '\u001b[30;1m',
  BRIGHT_RED: '\u001b[31;1m',
  BRIGHT_GREEN: '\u001b[32;1m',
  BRIGHT_YELLOW: '\u001b[33;1m',
  BRIGHT_BLUE: '\u001b[34;1m',
  BRIGHT_MAGENTA: '\u001b[35;1m',
  BRIGHT_CYAN: '\u001b[36;1m',
  BRIGHT_WHITE: '\u001b[37;1m',

  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
}

/**
 * Simplified codes which are used to refer to the costant _COLOR's colors.
 */
const _COLOR_CODE = {
  RESET: '&res',
  HIDDEN: '&hid',
  REVERSE: '&rev',
  BLINK: '&bli',
  UNDERLINE: '&und',

  BRIGHT_BLACK: '&b-b',
  BRIGHT_RED: '&b-r',
  BRIGHT_GREEN: '&b-g',
  BRIGHT_YELLOW: '&b-y',
  BRIGHT_BLUE: '&b-bl',
  BRIGHT_MAGENTA: '&b-m',
  BRIGHT_CYAN: '&b-c',
  BRIGHT_WHITE: '&b-w',

  BLACK: '&b',
  RED: '&r',
  GREEN: '&g',
  YELLOW: '&y',
  BLUE: '&bl',
  MAGENTA: '&m',
  CYAN: '&c',
  WHITE: '&w',
};

/**
 * Function used to create functions that will be used to print information on the screen.
 * 
 * @param {Object} options 
 * @returns this function returns an object of functions used to print 
 *          information on the screen.
 */
export default function (options) {
  let levels = {};

  Object.keys(options.levels).forEach(element => {

    // Creating the level
    let level = options.levels[element];
    level.name = element;

    // Assignment of the log function to the level with related settings
    levels[level.name] = function (string, target, args = {}) {

      // Variable used to check if the string passed in input is an object
      let isObject = (string instanceof Object || typeof string == "object");
      // Log target entered by the user
      let targetFormat = '';
      // Current date which is shown in log files and in the console
      let currentDate = getDate(options.dateFormat);

      // Checks the parameters passed by the user
      if (string == null || string == undefined) 
        throw new Error('The message to be printed cannot be null or undefined!');

      if (!(typeof target == "string") && target != undefined) {
        if (target instanceof Object) {
          args = target;
          target = undefined;
        } else 
          throw new Error('The message target must be a string!');
      }

      if (!(args instanceof Object) && args != undefined) 
        throw new Error('The message arguments must be contained in a subject! For more information see the documentation.');

      // Checks and assigns the target to the "targetFormat" variable, if the target does not exist
      // in the initial settings passed by the user then it is reported in the function trace() 
      if (target != undefined || target != null) {
        //Checks all targets
        Object.keys(options.targets).forEach(val => {
          let tar = options.targets[val];
          tar.name = val;
          if (tar.name == target)
            targetFormat = tar.format;
        });

        if (targetFormat == '')
          console.trace('The target "' + target + '" is not defined for the following message!');
      }
      
      // Creates the string which is printed on the screen and written in the file
      string = currentDate + level.format + ' ' + targetFormat + (targetFormat == '' ? '' : ' ') + (isObject ? JSON.stringify(string) : string) + _COLOR.RESET;

      // Replacing variables within the string with values
      // passed as function argument ("args")
      for (let i = 0; i < Object.keys(args).length; i++)
        string = string.split('%' + Object.keys(args)[i] + '%').join(Object.values(args)[i]);

      // Replacement of "_COLOR_CODE" with "_COLOR",
      // as only these are interpreted by the console.
      for (let i = 0; i < Object.values(_COLOR_CODE).length; i++) {
        /*if (i > 12)
          console.log(string.split(Object.values(_COLOR_CODE)[i]).join(Object.values(_COLOR)[i]));*/
        string = string.split(Object.values(_COLOR_CODE)[i]).join(Object.values(_COLOR)[i]);
      }

      // Writing in the log file by removing all colors from the string
      if ((typeof level.writeToLogFile == 'boolean') && (level.writeToLogFile || level.writeToLogFile == undefined))
        writeToFile(removeAllColors(string), options.logDirectory, options.months);

      // Prints message
      console.log(string);

      // Sends email
      if (level.sendMail != undefined && level.sendMail != null && level.sendMail == true)
        email.send(options.mail.template, {
          to: options.mail.to,
          subject: options.mail.subject,
          from: options.mail.from,
          host: options.mail.host,
          port: options.mail.port,
          secure: options.mail.secure,
          pool: options.mail.pool,
          auth: options.mail.auth,
          data: {
            message: removeAllColors(string),
            from: options.mail.from,
            date: currentDate
          }
        });
    }
  });

  // Adds the function to clean up the console
  levels.clearConsole = clearConsole;

  // Adds colors
  levels.COLOR = _COLOR;

  /**
   * Function used to get the current time.
   * 
   * @returns Date.now()
   */
  levels.startTime = () => Date.now();

  /**
   * Function used to calculate the execution time from the current time 
   * and the time previously obtained by "startTime()".
   * 
   * @param {Date} startTime start time, obtained with the "startTime" function
   * @param {Object} param1 settings for the coding of the calculated time
   * @returns 
   */
  levels.endTime = (startTime, unit = 'ms', decimals = 3) => {
    if (typeof unit == "number") {
      decimals = unit;
      unit = 'ms';
    }

    const _STOP_TIME = Date.now() - startTime;
    const _UNITS = ['ns', 'ms', 's', 'm', 'h'];
    const _UNITS_CHANGE = [100000, 1, 0.001, 1.6667e-5, 2.7778e-7];

    if (!_UNITS.includes(unit)) console.trace('As a unit of measurement to calculate the time you must enter one of these values: ' + _UNITS.join(', '));

    return Number.parseFloat(_UNITS_CHANGE[_UNITS.indexOf(unit)] * _STOP_TIME).toFixed(decimals);
  }

  return levels;
}

/**
 * Function used to write a log inside
 * a file which is contained in the folder representing the current month,
 * which is within a given path.
 * 
 * @param {String} string data that need to be written.
 * @param {String} path   path to the log folder.
 * @param {Array} months current month, used to insert
 *                       the file in the right folder.
 */
async function writeToFile(string, path, months) {
  const _MAIN_PATH = process.cwd().replace('file://', '');
  let rootPath = _MAIN_PATH;

  if (path.charAt(0) != '/')
    rootPath = rootPath.concat('/');

  //Log folder initialization, specified in the configuration object
  if (!existsSync(rootPath + path.trim())) {
    let partialPath = '';
    for (let i = 0; i < path.split('/').length; i++) {
      partialPath = partialPath.concat(path.split('/')[i].trim() + '/');
      if (!(existsSync(rootPath + partialPath)))
        mkdirSync(rootPath + partialPath);
    }
  }

  let date = new Date();

  if (!existsSync(rootPath + path.trim() + date.getFullYear()))
    mkdirSync(rootPath + path.trim() + date.getFullYear());

  if (!existsSync(rootPath + path.trim() + date.getFullYear() + '/' + months[date.getMonth()]))
    mkdirSync(rootPath + path.trim() + date.getFullYear() + '/' + months[date.getMonth()]);

  appendFile(rootPath + path.trim() + date.getFullYear() + '/' + months[date.getMonth()] + '/' + ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + '.log', getDate() + string + '\n', function (err) {
    if (err)
      throw new Error(err);
  });
}

/**
 * Function used to remove all colors from a String.
 * 
 * @param {String} string String from which every colors need to be deleted
 */
function removeAllColors(string) {
  for (let i = 0; i < Object.values(_COLOR).length; i++)
    string = string.split(Object.values(_COLOR)[i]).join('').split(Object.values(_COLOR_CODE)[i]).join('');
  return string;
}

/**
 * This function is used to clear the console.
 */
let clearConsole = () => {
  console.clear();
}

/**
 * This function is used to get the date and time according
 * to the specifications that the user has entered in the configuration object.
 * 
 * @param {String} dateFormat date format to show..
 * @returns {String} the return is the string displayed on the screen.
 */
function getDate(dateFormat) {
  if (dateFormat == null || dateFormat == undefined || dateFormat == '' || dateFormat == ' ') {
    return '';
  } else {
    let date = new Date();
    return dateFormat
      .replace('ss', ('0' + date.getSeconds()).slice(-2))
      .replace('mm', ('0' + date.getMinutes()).slice(-2))
      .replace('hh', ('0' + date.getHours()).slice(-2))
      .replace('GG', ('0' + date.getDate()).slice(-2))
      .replace('MM', ('0' + (date.getMonth() + 1)).slice(-2))
      .replace('YYYY', date.getFullYear())
      .replace('YY', date.getFullYear().toString().substring(2))
      .concat(' ');
  }
}

const __COLOR = _COLOR;
export { __COLOR as _COLOR };
const _clearConsole = clearConsole;
export { _clearConsole as clearConsole };