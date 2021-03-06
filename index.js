/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

import _validate from 'jsonschema';
import scheduler from './lib/modules/scheduler.js';
import zipper from './lib/modules/zipper.js';
import logger from './lib/logger.js';

const validate = _validate.validate;

/**
 * Default Settings
 */
import _DEFAULT_SETTINGS from './lib/settings.json' assert {type: 'json'};

/**
 * JSON schema used to verify the type of data entered by the user.
 */
import _SETTINGS_SCHEMA from './lib/settingsSchema.json' assert {type: 'json'};


/**
 * The whole settings. This object is obtained through
 * a merge of the settings object passed by the user and 
 * the default settings.
 */
let settings;

/**
 * Main function of the project. This function checks the validity
 * of the input data and initializes the logger.
 * 
 * @param {Object} options settings chosen by the user
 * @returns functions used to manage the console
 */
export default function (options) {

  if (!(options instanceof Object) && options != undefined)
    throw new Error('You must pass an object as an argument to the logger!');

  if (options != {})
    settings = merge(_DEFAULT_SETTINGS, options);
  
  // Checks for any errors in the settings object data
  let jsonStatus = validate(settings, _SETTINGS_SCHEMA);

  // Displays any errors on the screen
  if (!jsonStatus.valid) {
    let errorString = "One or more values ​​of the entered settings does not conform to the default formats: \n";

    for (let i = 0; i < jsonStatus.errors.length; i++) 
      errorString += "       " + jsonStatus.errors[i].path.join(".") + " (value: " + jsonStatus.errors[i].instance + ") " + jsonStatus.errors[i].message + "\n";      
    
    throw new Error(errorString);
  }

  // Verifies the correctness of "zipFolder" and eventually starts the scheduler
  if (settings.zipFolders == true) {
    // When the logger object is initialized, a scan of the folders is started immediately
    // to check if there are any past months, in which case they will be zipped to save space on the disk.
    zipper(settings.logDirectory, settings.months);

    // Starts the scheduler to zip the folders every beginning of the month
    scheduler(settings.logDirectory, settings.months);
  }

  return logger(settings);
}

/**
 * Recursively merge properties of two objects.
 * 
 * @param {Object} obj1 
 * @param {Object} obj2 
 * @returns merge of the two objects passed as parameters
 */
function merge(obj1, obj2) {
  for (var p in obj2)
    try {
      if (obj2[p].constructor == Object)
        obj1[p] = merge(obj1[p], obj2[p]);
      else
        obj1[p] = obj2[p];
    } catch (e) {
      obj1[p] = obj2[p];
    }

  return obj1;
}