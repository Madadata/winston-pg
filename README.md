# Postgres transport for Winston

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
