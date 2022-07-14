/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

import { createWriteStream, existsSync, readdirSync, statSync, unlinkSync, rmdirSync, readdir } from 'fs';
import archiver from 'archiver';

/**
 * Function used to zip the month folders.
 *
 * @param {String} path path to the log folder.
 * @param {Array} months 12 months, used for creating folders to 
 *                       group log files.
 */
export default async function(path, months) {
  const _MAIN_PATH = process.cwd().replace('file://', '');
  let rootPath = _MAIN_PATH;
  
  if (path.split("")[0] != "/")
    rootPath += ("/" + path);
  else
    rootPath += (path);

  console.log(rootPath);

  // Takes all the directories contained in the root path and saves them in the years variable
  let years = [];
  try {
    readdir(rootPath, (err, files) => {
      if (files != undefined)
        files.forEach(directory => {
          if (!directory.includes("."))
            years[years.length] = directory;
        });

      // Takes all the months contained in years, except the current month, and saves them in the mouthToCompress array
      years.forEach(year => {
        let currentDate = new Date();

        readdir(rootPath + year, (err, subdirectory) => {

          let mouthToCompress = [];
          subdirectory.forEach(mouth => {
            for (var i = 0; i < months.length; i++)
              if (months[i] == mouth && mouth != months[currentDate.getMonth()])
                mouthToCompress[mouthToCompress.length] = mouth;
          });

          mouthToCompress.forEach(mouth => {

            // Compresses all mouthToCompresses into a directory containing the year
            const output = createWriteStream(rootPath + year + "/" + mouth + '.zip');
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

            // Deletes the folder containing the uncompressed months
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
 * Function used to remove a folder.
 * 
 * @param {String} path path to the folder.
 */
const removeDir = function (path) {
  try {
    if (existsSync(path)) {
      const files = readdirSync(path);

      if (files.length > 0) {
        files.forEach(function (filename) {
          if (statSync(path + "/" + filename).isDirectory()) {
            removeDir(path + "/" + filename);
          } else {
            unlinkSync(path + "/" + filename);
          }
        })
        rmdirSync(path);
      } else {
        rmdirSync(path);
      }
    } else {
      console.log("Directory path not found.");
    }
  } catch (error) {
    console.error("Error deleting directory: ", error);
  }
}