'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../data/config');

var _config2 = _interopRequireDefault(_config);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExtractJwt = _passportJwt2.default.ExtractJwt;
var JwtStrategy = _passportJwt2.default.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = _config2.default.TOKEN_SECRET;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  _User2.default.findOne({ username: jwt_payload.username }, 'userStatus username passcode agent superAgent email phoneNumber minBetAmount maxBetAmount maxWinAmount weeklyBalance thisWeekBalance thisWeekLossAmount thisWeekWonAmount lastWeekBalance lastWeekLossAmount lastWeekWonAmount currentOpenBetAmount', function (err, user) {
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

exports.default = strategy;
//# sourceMappingURL=jwtStrategy.js.map