# Postgres transport for Winston

[![CircleCI](https://circleci.com/gh/Madadata/winston-pg.svg?style=svg)](https://circleci.com/gh/Madadata/winston-pg)
[![Dependency Status](https://david-dm.org/Madadata/winston-pg.svg)](https://david-dm.org/Madadata/winston-pg)

## Install

```sh
npm install --save winston pg winston-pg
```

Both `pg` and `winsotn` are peer dependencies.

## Test and example

See [index.spec.js](https:///Madadata/winston-pg/blob/master/test/index.spec.js) for test spec.

Example usage:

```js
const pgLogger = new PgLogger({
  name: 'test-logger',
  level: 'debug',
  connString: 'postgres://ubuntu@localhost:5432/circle_test',
  tableName: 'winston_logs',
});
logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      color: true,
      timestamp: true,
    }),
    pgLogger,
  ]
});
pgLogger.initTable(done); // or create the table in database by yourself
```
