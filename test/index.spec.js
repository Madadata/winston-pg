import PgLogger from '../src';
import winston from 'winston';

describe('logging', () => {

  let logger;

  before(done => {
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
    pgLogger.initTable(done);
  });

  it('works', done => {
    logger.on('logged', () => done());
    logger.on('error', done);
    logger.log('info', 'it works', { funniness: "👌" });
  });
});
