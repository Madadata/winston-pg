import util from 'util';
import pg from 'pg';
import winston from 'winston';

export default class PgLogger extends winston.Transport {

  constructor(options) {
    super();
    const { name, level, connString, tableName, initTable } = options;
    if (!connString) {
      throw new Error('empty connString');
    }
    if (!tableName) {
      throw new Error('empty table name');
    }
    this.name = name || 'PgLogger';
    this.level = level || 'info';
    this.tableName = tableName;
    this.connString = connString;
    if (initTable) {
      this.initTable();
    }
  }

  initTable(callback) {
    pg.connect(this.connString, (err, client, pgDone) => {
      if (err) {
        callback(err);
      } else {
        client.query(`CREATE TABLE IF NOT EXISTS "${this.tableName}" (
          id serial primary key,
          ts timestamp default current_timestamp,
          level varchar(10) not null,
          message varchar(1024) not null,
          meta json
        )`, [], (err, result) => {
          pgDone();
          if (err) {
            callback(err);
          } else {
            callback();
          }
        });
      }
    });
  }

  log(level, msg, meta, callback) {
    const logger = this;
    pg.connect(this.connString, (err, client, pgDone) => {
      if (err) {
        // failed to acquire connection
        logger.emit('error', err);
        callback(err);
      } else {
        client.query(`INSERT INTO "${this.tableName}" (level, message, meta) VALUES ($1, $2, $3)`,
                     [level, msg, meta instanceof Array ? JSON.stringify(meta) : meta],
                     (err, result) => {
            pgDone();
            if (err) {
              logger.emit('error', err);
              callback(err);
            } else {
              logger.emit('logged');
              callback(null, true);
            }
        });
      }
    });
  }

}
