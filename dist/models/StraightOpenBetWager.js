'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var Schema = _mongoose2.default.Schema;

var StraightOpenBetWagerSchema = _mongoose2.default.Schema({
	betType: String,
	agent: String, // who is agent
	superAgent: String,
	playerUsername: String,
	event: Object,
	orderStatus: String, // open / completed / cancelled
	orderTimePST: String // use PST
});

var StraightOpenBetWager = _mongoose2.default.model('straightOpenBetWager', StraightOpenBetWagerSchema);

exports.default = StraightOpenBetWager;
//# sourceMappingURL=StraightOpenBetWager.js.map