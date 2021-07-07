/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

const fs = require('fs');

/**
 * Colors code, used for the console coloring.
 */
const _COLOR = {
  RESET: '\x1b[0m',
  HIDDEN: '\x1b[8m',
  REVERSE: '\x1b[7m',
  BLINK: '\x1b[5m',
  UNDERSCORE: '\x1b[4m',
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
  RESET: '&r',
  HIDDEN: '&k',
  REVERSE: '&x',
  BLINK: '&z',
  UNDERSCORE: '&n',
  BLACK: '&0',
  RED: '&c',
  GREEN: '&a',
  YELLOW: '&e',
  BLUE: '&9',
  MAGENTA: '&5',
  CYAN: '&b',
  WHITE: '&f',
};

/**
 * Funzione utilizzata per la creazione delle funzione che verranno utilizzate
 * per stampare le informazioni a video.
 * 
 * @param {Object} options 
 * @returns questa funzione ritorna un oggetto di funzioni utilizzate per 
 *          stampare a video le informazioni.
 */
module.exports = function (options) {
  let levels = {};

  Object.keys(options.levels).forEach(element => {

    //Creazione del livello
    let level = options.levels[element];
    level.name = element;

    //Assegnazione della funzione di log al livello con relative impostazioni
    levels[level.name] = function (string, target, args = {}) {
      //Variabile utilizzata per verificare se la stringa passata in input è un oggetto
      let isObject = (string instanceof Object || typeof string == "object");
      //Target del log inserito dall'utente
      let targetFormat = '';
      //Data attuale, utilizzata per essere mostrata nei file di log e nella console
      let currentDate = getDate(options.dateFormat);;

      //Verifica dei parametri passati dall'utente
      if (string == null || string == undefined) throw new Error('The message to be printed cannot be null or undefined!');
      if (!(typeof target == "string") && target != undefined) throw new Error('The message target must be a string!');
      if (!(args instanceof Object) && args != undefined) throw new Error('The message arguments must be contained in a subject! For more information see the documentation.');

      //Verifica e assegnazione del target alla variabile "targetFormat", se il target non esiste
      //nelle impostazioni iniziali passate dall'utente, allora viene segnalato attraverso la 
      //funzione trace()
      if (target != undefined || target != null) {
        //Verifica di tutti i target
        Object.keys(options.targets).forEach(val => {
          let tar = options.targets[val];
          tar.name = val;
          if (tar.name == target)
            targetFormat = tar.format;
        });

        if (targetFormat == '')
          console.trace('The target "' + target + '" is not defined for the following message!');
      }
      
      //Creazione della stringa da stampare a video e da scrivere nel file
      string = currentDate + level.format + ' ' + targetFormat + (targetFormat == '' ? '' : ' ') + (isObject ? JSON.stringify(string) : string) + '&r';

      //Sostituzione delle variabili all'interno della stringa con i valori
      //passati come argomento della funzione ("args")
      for (let i = 0; i < Object.keys(args).length; i++)
        string = string.split('%' + Object.keys(args)[i] + '%').join(Object.values(args)[i]);

      //Sostituzione dei "_COLOR_CODE" con i "_COLOR", poichè solo questi sono
      //interpretati dalla console.
      for (let i = 0; i < Object.values(_COLOR_CODE).length; i++)
        string = string.split(Object.values(_COLOR_CODE)[i]).join(Object.values(_COLOR)[i]);

      //Scrittura nel file dei log rimuovendo tutti i colori dalla stringa
      if ((typeof level.writeToLogFile == 'boolean') && (level.writeToLogFile || level.writeToLogFile == undefined))
        writeToFile(removeAllColors(string), options.logDirectory, options.months);

      //print message
      console.log(string);

      //send email
      if (level.sendMail != undefined && level.sendMail != null && level.sendMail == true)
        require('./modules/email/email').send(options.mail.template, {
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

  //Aggiunta della funzione per ripulire la console
  levels.clearConsole = clearConsole;

  return levels;
}

/**
 * Funzione utilizzata per scrivere un log all'interno di 
 * un file contenuto nella cartella che rappresenta il mese
 * attuale, la quale è all'interno di  un determinato path.
 * 
 * @param {String} string dati da scrivere.
 * @param {String} path   per la cartella dei log.
 * @param {Array} months mese corrente, utilizzato per inserire
 *                       il file nella giusta cartella.
 */
async function writeToFile(string, path, months) {
  const _MAIN_PATH = require.main.filename.split('/');
  _MAIN_PATH.pop();
  let rootPath = _MAIN_PATH.join('/');

  if (path.charAt(0) != '/')
    rootPath = rootPath.concat('/');

  //Log folder initialization, specified in the configuration object
  if (!fs.existsSync(rootPath + path.trim())) {
    let partialPath = '';
    for (let i = 0; i < path.split('/').length; i++) {
      partialPath = partialPath.concat(path.split('/')[i].trim() + '/');
      if (!(fs.existsSync(rootPath + partialPath)))
        fs.mkdirSync(rootPath + partialPath);
    }
  }

  let date = new Date();

  if (!fs.existsSync(rootPath + path.trim() + date.getFullYear()))
    fs.mkdirSync(rootPath + path.trim() + date.getFullYear());

  if (!fs.existsSync(rootPath + path.trim() + date.getFullYear() + '/' + months[date.getMonth()]))
    fs.mkdirSync(rootPath + path.trim() + date.getFullYear() + '/' + months[date.getMonth()]);

  fs.appendFile(rootPath + path.trim() + date.getFullYear() + '/' + months[date.getMonth()] + '/' + ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + '.log', getDate() + string + '\n', function (err) {
    if (err)
      throw new Error(err);
  });
}

/**
 * Funzione utilizzata per rimuovere tutti i colori da
 * una Stringa.
 * 
 * @param {String} string dalla quale bisogno eliminare tutti
 *                        i colori.
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
 * Questa funzione viene utilizzata per ottenere la data e l'ora seocondo 
 * le specifiche che l'utente ha inserito nel'oggetto di configurazione.
 * 
 * @param {String} dateFormat formato della data da mostrare.
 * @returns {String} il ritorno è la stringa da stampare a videos.
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

module.exports._COLOR = _COLOR;
module.exports.clearConsole = clearConsole;