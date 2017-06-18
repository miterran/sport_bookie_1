'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/user-register', function (req, res) {
	var newUser = new _User2.default({
		userStatus: 'player', // player / agent / superAgent / boss
		superAgent: 'superAgent', // who is super agent
		agent: 'agent', // who is agent
		username: 'user2',
		password: '1234',
		passcode: '4321',
		email: '',
		phoneNumber: '',
		minBetAmount: 20,
		maxBetAmount: 2000,
		maxWinAmount: 5000,
		weeklyBalance: 100000,
		thisWeekBalance: 0,
		thisWeekLossAmount: 0,
		thisWeekWonAmount: 0,
		currentOpenBetAmount: 0,
		accountActive: true
	});
	newUser.save().then(function () {
		console.log('saved');
		res.json({ accountCreated: true });
	});
});

exports.default = router;
//# sourceMappingURL=userRegister.js.map