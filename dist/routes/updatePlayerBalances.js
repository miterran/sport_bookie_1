'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _StraightOpenBetWager = require('../models/StraightOpenBetWager');

var _StraightOpenBetWager2 = _interopRequireDefault(_StraightOpenBetWager);

var _StraightBetWagerResult = require('../models/StraightBetWagerResult');

var _StraightBetWagerResult2 = _interopRequireDefault(_StraightBetWagerResult);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _JwtStrategy = require('../middleware/JwtStrategy');

var _JwtStrategy2 = _interopRequireDefault(_JwtStrategy);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


_passport2.default.use(_JwtStrategy2.default);

router.get('/update-player-balances', _passport2.default.authenticate('jwt', { session: false }), function (req, res) {
	var thisWeeklyBalance = 0;
	var thisWeekWonAmount = 0;
	var thisWeekLossAmount = 0;
	var currentOpenBetAmount = 0;

	_StraightBetWagerResult2.default.find({ playerUsername: req.user.username, finalConfirmTimePST: { $gt: (0, _moment2.default)().startOf('week').unix(), $lt: (0, _moment2.default)().endOf('week').unix() } }, function (err, result) {
		if (result.length > 0) {
			result.map(function (history, historyIdx) {
				switch (history.wagerResult) {
					case 'won':
						thisWeekWonAmount += history.event.WagerDetail.estWinAmount;
						break;
					case 'loss':
						thisWeekLossAmount -= history.event.WagerDetail.estRiskAmount;
					default:
						return;
				}
			});
		}

		_StraightOpenBetWager2.default.find({ playerUsername: req.user.username }, function (err, result) {
			if (result.length > 0) {
				result.map(function (openBet, openBetIdx) {
					console.log(currentOpenBetAmount);
					currentOpenBetAmount += Number(openBet.event.WagerDetail.estRiskAmount);
				});
			}

			thisWeeklyBalance = req.user.weeklyBalance + thisWeekWonAmount + thisWeekLossAmount - currentOpenBetAmount;
			_User2.default.findOneAndUpdate({ username: req.user.username }, { '$set': {
					currentOpenBetAmount: currentOpenBetAmount,
					thisWeekBalance: thisWeeklyBalance,
					thisWeekWonAmount: thisWeekWonAmount,
					thisWeekLossAmount: thisWeekLossAmount
				} }, { new: true }, function (err, result) {

				res.json(result);
			});
		});
	});
});

router.get('/update-player-status', _passport2.default.authenticate('jwt', { session: false }), function (req, res) {
	_User2.default.find({ username: req.user.username }, 'userStatus username passcode agent superAgent email phoneNumber minBetAmount maxBetAmount maxWinAmount weeklyBalance thisWeekBalance thisWeekLossAmount thisWeekWonAmount lastWeekBalance lastWeekLossAmount lastWeekWonAmount currentOpenBetAmount', function (err, result) {
		var latestPlayerStatus = result[0];
		latestPlayerStatus.passcode = undefined;

		res.json(latestPlayerStatus);
	});
});

exports.default = router;

//console.log(moment().startOf('week').subtract(7, 'days'))
// console.log(moment().startOf('week'))
// console.log(moment().endOf('week'))


// User.findOneAndUpdate({username: req.body.username}, function(err, result){

// })
//# sourceMappingURL=updatePlayerBalances.js.map