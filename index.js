/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

const scheduler = require('./lib/modules/scheduler');
const validate = require('jsonschema').validate;

/**
 * Impostazioni di default
 */
const _DEFAULT_SETTINGS = require('./lib/settings.json');

/**
 * JSON schema utilizzato per verificare la tipologia di 
 * dati inseriti dall'utente.
 */
const _SETTINGS_SCHEMA = require('./lib/settingsSchema.json');

/**
 * Impostazioni complete. Questo oggetto viene ottenuto facendo 
 * un merge dell'oggetto delle impostazioni passato dall'utente e 
 * le impostazioni di default.
 */
let settings;

/**
 * Funziona principale del progetto. Tale funzione ha il compito
 * di verificare la validità dei dati passati in input e inizializzare
 * il logger.
 * 
 * @param {Object} options impostazioni scelte dall'utente
 * @returns funzioni utilizzate per gestire la console
 */
module.exports = function (options) {

  if (!(options instanceof Object) && options != undefined)
    throw new Error('You must pass an object as an argument to the logger!');

  if (options != {})
    settings = merge(_DEFAULT_SETTINGS, options);

  //Verifica di eventuali errori nei dati dell'oggetto delle impostazioni
  let jsonStatus = validate(settings, _SETTINGS_SCHEMA);

  //Visualizzazione a video degli eventuali errori
  if (!jsonStatus.valid) {
    let errorString = "One or more values ​​of the entered settings does not conform to the default formats: \n";

    for (let i = 0; i < jsonStatus.errors.length; i++) 
      errorString += "       " + jsonStatus.errors[i].path.join(".") + " (value: " + jsonStatus.errors[i].instance + ") " + jsonStatus.errors[i].message + "\n";      
    
    throw new Error(errorString);
  }

  // Verifica correttezza di "zipFolder" ed eventuale avvio dello scheduler
  if (settings.zipFolders == true) {

    //Quando viene inizializzato l'oggetto logger viene avviata subito una scansione
    //delle cartelle per verificare se sono presenti mesi passati, in tal caso 
    //verranno zippati per risparmiare spazio sul disco.
    require('./lib/modules/zipper').folderZipper(settings.logDirectory, settings.months);

    //Avvio dello schedulatore per zippare le cartelle ogni inizio del mese
    scheduler.runFolderZipper(settings.logDirectory, settings.months);
  }

  return require('./lib/logger')(settings);
}

/**
 * Recursively merge properties of two objects.
 * 
 * @param {Object} obj1 
 * @param {Object} obj2 
 * @returns unione dei due oggetti passati come parametri
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