'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _JwtStrategy = require('../middleware/JwtStrategy');

var _JwtStrategy2 = _interopRequireDefault(_JwtStrategy);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _StraightOpenBetWager = require('../models/StraightOpenBetWager');

var _StraightOpenBetWager2 = _interopRequireDefault(_StraightOpenBetWager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

_passport2.default.use(_JwtStrategy2.default);

router.get('/fetch-player-straight-openbet-wager', _passport2.default.authenticate('jwt', { session: false }), function (req, res) {
	_StraightOpenBetWager2.default.find({ playerUsername: req.user.username }, function (err, result) {
		res.json(result);
	});
});

exports.default = router;
//# sourceMappingURL=fetchPlayerStraightOpenBetWager.js.map