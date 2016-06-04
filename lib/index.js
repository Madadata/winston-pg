'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PgLogger = function (_winston$Transport) {
  _inherits(PgLogger, _winston$Transport);

  function PgLogger(options) {
    _classCallCheck(this, PgLogger);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PgLogger).call(this));

    var name = options.name;
    var level = options.level;
    var connString = options.connString;
    var tableName = options.tableName;
    var initTable = options.initTable;

    if (!connString) {
      throw new Error('empty connString');
    }
    if (!tableName) {
      throw new Error('empty table name');
    }
    _this.name = name || 'PgLogger';
    _this.level = level || 'info';
    _this.tableName = tableName;
    _this.connString = connString;
    if (initTable) {
      _this.initTable();
    }
    return _this;
  }

  _createClass(PgLogger, [{
    key: 'initTable',
    value: function initTable(callback) {
      var _this2 = this;

      _pg2.default.connect(this.connString, function (err, client, pgDone) {
        if (err) {
          callback(err);
        } else {
          client.query('CREATE TABLE IF NOT EXISTS "' + _this2.tableName + '" (\n          id serial primary key,\n          ts timestamp default current_timestamp,\n          level varchar(10) not null,\n          message varchar(1024) not null,\n          meta json\n        )', [], function (err, result) {
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
  }, {
    key: 'log',
    value: function log(level, msg, meta, callback) {
      var _this3 = this;

      var logger = this;
      _pg2.default.connect(this.connString, function (err, client, pgDone) {
        if (err) {
          // failed to acquire connection
          logger.emit('error', err);
          callback(err);
        } else {
          client.query('INSERT INTO "' + _this3.tableName + '" (level, message, meta) VALUES ($1, $2, $3)', [level, msg, meta instanceof Array ? JSON.stringify(meta) : meta], function (err, result) {
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
  }]);

  return PgLogger;
}(_winston2.default.Transport);

exports.default = PgLogger;