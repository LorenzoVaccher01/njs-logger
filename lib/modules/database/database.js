/*
* Author: LorenzoVaccher01
* Author URI: https://lorenzovaccher.com
* Copyright (c) 2021 Lorenzo Vaccher
*/

const mysql = require('mysql');

/**
 * This function is used to execute a query synchronously.
 * 
 * @param {string} queryDb Query that needs to be run 
 */
let query = function (queryDb) {
  let connection = mysql.createConnection({
    host: settings.database.host,
    user: settings.database.user,
    port: settings.database.port,
    password: settings.database.password,
    database: settings.database.database,
    insecureAuth: settings.database.insecureAuth
  });

  connection.connect(function (error) {
    if (error) throw error;
  });

  let prom = new Promise((resolve, reject) => {
    connection.query(queryDb, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  connection.end();

  return prom;
};

/**
 * This function is used to execute queries asynchronously.
 * @param {string} queryDb query da eseguire
 */
let asyncQuery = function (queryDb) {
  let connection = mysql.createConnection({
    host: settings.database.host,
    user: settings.database.user,
    port: settings.database.port,
    password: settings.database.password,
    database: settings.database.database,
    insecureAuth: settings.database.insecureAuth
  });


  connection.connect(function (error) {
    if (error) throw error;
  });

  connection.query(queryDb, function (err, result) {
    if (err) logger.error(err);
  });

  connection.end();
};

/**
 * 
 * @param {string} str stringa da controllare
 */
let escape = function (str) {
  return mysql.escape(str);
};

module.exports.query = query;
module.exports.asyncQuery = asyncQuery;
module.exports.escape = escape;
