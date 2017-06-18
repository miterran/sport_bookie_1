'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/user-login', function (req, res) {
	_User2.default.findOne({ username: req.body.username }, '_id userStatus username password email phoneNumber minBetAmount maxBetAmount maxWinAmount weeklyBalance thisWeekBalance thisWeekLossAmount thisWeekWonAmount lastWeekBalance lastWeekLossAmount lastWeekWonAmount currentOpenBetAmount', function (err, result) {
		if (result) {
			if (result.password == req.body.password) {
				var token = _jsonwebtoken2.default.sign({
					id: result._id,
					userStatus: result.userStatus,
					username: result.username,
					email: result.phoneNumber,
					phoneNumber: result.phoneNumber,
					minBetAmount: result.minBetAmount,
					maxBetAmount: result.maxBetAmount,
					maxWinAmount: result.maxWinAmount,
					weeklyBalance: result.weeklyBalance,
					thisWeekBalance: result.thisWeekBalance,
					thisWeekLossAmount: result.thisWeekLossAmount,
					thisWeekWonAmount: result.thisWeekWonAmount,
					lastWeekBalance: result.lastWeekBalance,
					lastWeekWonAmount: result.lastWeekWonAmount,
					lastWeekLossAmount: result.thisWeekLossAmount,
					currentOpenBetAmount: result.currentOpenBetAmount
				}, 'diamond');
				return res.status(200).send(token);
			} else {
				return res.status(404).send('password not correct');
			}
		} else {
			return res.status(404).send('user not found');
		}
	});
});

exports.default = router;
//# sourceMappingURL=userLogin.js.map