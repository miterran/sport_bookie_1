'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var Schema = _mongoose2.default.Schema;

var UserSchema = _mongoose2.default.Schema({
	userStatus: String, // player / agent / superAgent / boss
	superAgent: String, // who is super agent
	agent: String, // who is agent
	username: String,
	password: String,
	passcode: String,
	email: String,
	phoneNumber: String,
	minBetAmount: Number,
	maxBetAmount: Number,
	maxWinAmount: Number,
	weeklyBalance: Number,
	thisWeekBalance: Number,
	thisWeekLossAmount: Number,
	thisWeekWonAmount: Number,
	lastWeekBalance: Number,
	lastWeekLossAmount: Number,
	lastWeekWonAmount: Number,
	currentOpenBetAmount: Number,
	accountActive: Boolean
});

var User = _mongoose2.default.model('user', UserSchema);

exports.default = User;
//# sourceMappingURL=User.js.map