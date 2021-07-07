/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

const fs = require('fs');
const archiver = require('archiver');

/**
 * Funzione utilizzata per zippare le cartelle dei mesi.
 *
 * @param {String} path percorso della cartella dei log.
 * @param {Array} months 12 mesi, utilizzati per la creazione delle
 *                       cartelle per raggruppare i file dei log.
 */
module.exports.folderZipper = async function (path, months) {
  const _MAIN_PATH = require.main.filename.split('/');
  _MAIN_PATH.pop();

  let rootPath = _MAIN_PATH.join('/');

  if (path.split("")[0] != "/")
    rootPath += ("/" + path);
  else
    rootPath += (path);

  //prende tutte le directory contenute nella rootpath e le salva nella variabile years
  let years = [];
  try {
    require('fs').readdir(rootPath, (err, files) => {
      files.forEach(directory => {
        if (!directory.includes("."))
          years[years.length] = directory;
      });

      //prende tutti i mesi contenuti in years, fatta eccezione del mese attuale, e li salva nell'array mouthToCompress
      years.forEach(year => {
        let currentDate = new Date();

        require('fs').readdir(rootPath + year, (err, subdirectory) => {

          let mouthToCompress = [];
          subdirectory.forEach(mouth => {
            for (var i = 0; i < months.length; i++)
              if (months[i] == mouth && mouth != months[currentDate.getMonth()])
                mouthToCompress[mouthToCompress.length] = mouth;
          });

          mouthToCompress.forEach(mouth => {

            //comprime tutti i mouthToCompress in una directory contenente l'anno
            const output = fs.createWriteStream(rootPath + year + "/" + mouth + '.zip');
            const archive = archiver('zip', {
              zlib: {
                level: 9
              }
            });

            archive.on('warning', (err) => {
              if (err.code === 'ENOENT') {
                console.trace(err);
              } else {
                throw err;
              }
            });

            archive.on('error', (error) => {
              throw error;
            });

            archive.directory(rootPath + year + "/" + mouth, false);

            archive.pipe(output);
            archive.finalize();

            //cancella la cartella contenente i mesi non compressi
            removeDir(rootPath + year + "/" + mouth);
          })
        })
      });
    });
  } catch (error) {
    console.error("Error while catching directory:", error);
  }
}

/**
 * Funzione utilizzata per rimuovere una cartella.
 * 
 * @param {String} path percorso della cartella.
 */
const removeDir = function (path) {
  try {
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path);

      if (files.length > 0) {
        files.forEach(function (filename) {
          if (fs.statSync(path + "/" + filename).isDirectory()) {
            removeDir(path + "/" + filename);
          } else {
            fs.unlinkSync(path + "/" + filename);
          }
        })
        fs.rmdirSync(path);
      } else {
        fs.rmdirSync(path);
      }
    } else {
      console.log("Directory path not found.");
    }
  } catch (error) {
    console.error("Error deleting directory: ", error);
  }
}