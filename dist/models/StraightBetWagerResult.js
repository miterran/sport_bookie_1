'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var Schema = _mongoose2.default.Schema;

var StraightBetWagerResultSchema = _mongoose2.default.Schema({
	betType: String,
	agent: String, // who is agent
	superAgent: String,
	playerUsername: String,
	event: Object,
	eventResult: Object,
	wagerResult: String, // won / loss / tie // cancelled
	orderStatus: String, // open / completed / cancelled
	orderTimePST: String, // use PST
	finalConfirmTimePST: String
});

var StraightBetWagerResult = _mongoose2.default.model('straightBetWagerResult', StraightBetWagerResultSchema);

exports.default = StraightBetWagerResult;
//# sourceMappingURL=StraightBetWagerResult.js.map