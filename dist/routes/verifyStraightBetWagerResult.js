'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _StraightBetWagerResult = require('../models/StraightBetWagerResult');

var _StraightBetWagerResult2 = _interopRequireDefault(_StraightBetWagerResult);

var _StraightOpenBetWager = require('../models/StraightOpenBetWager');

var _StraightOpenBetWager2 = _interopRequireDefault(_StraightOpenBetWager);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _jwtStrategy = require('../middleware/jwtStrategy');

var _jwtStrategy2 = _interopRequireDefault(_jwtStrategy);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../data/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

_passport2.default.use(_jwtStrategy2.default);

var oddHeader = { "JsonOdds-API-Key": _config2.default.JSON_ODD_KEY };
//import jsonSportArr from '../data/jsonSportArray';
// const sortOddTypes = ["Game", "First Half", "Second Half", "First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter", "First Period", "Second Period", "Third Period", "First Five Innings", "First Inning"]
// const sortSports = ['NBA', 'MLB', 'NCAAB', 'NCAAF', 'NFL', 'NHL', 'WNBA', 'SOCCER', 'TENNIS', 'BOXING', 'MMA', 'CRICKET', 'HORSE-RACING', 'KHL', 'AHL', 'SHL', 'HALL', 'LMP', 'NPB', 'KBO', 'GOLF', 'RUGBY', 'WBC']


//, passport.authenticate('jwt', {session: false})

router.get('/verify-straight-bet-wager-result', _passport2.default.authenticate('jwt', { session: false }), function (req, res) {
	_StraightOpenBetWager2.default.find({}, function (err, openBets) {
		if (openBets.length > 0) {
			Promise.all(openBets.map(function () {
				var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(openBet, openBetIdx) {
					var data, result, eventResult, HomeSpreadPoint, AwaySpreadPoint, TotalPoint, finalResult;
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									_context.next = 2;
									return (0, _nodeFetch2.default)('https://jsonodds.com/api/results/getbyeventid/' + openBet.event.eventID + '?oddType=' + openBet.event.BetDetail.OddType, { headers: oddHeader });

								case 2:
									data = _context.sent;
									_context.next = 5;
									return data.json();

								case 5:
									result = _context.sent;
									eventResult = result[0];

									if (!(eventResult.Final === true)) {
										_context.next = 81;
										break;
									}

									openBet.wagerResult = '';
									_context.t0 = eventResult.FinalType;
									_context.next = _context.t0 === 'Finished' ? 12 : _context.t0 === 'Canceled' ? 71 : _context.t0 === 'Postponed' ? 73 : 75;
									break;

								case 12:
									_context.t1 = openBet.event.BetDetail.BetType;
									_context.next = _context.t1 === 'M Line' ? 15 : _context.t1 === 'Spread' ? 27 : _context.t1 === 'Total' ? 55 : 68;
									break;

								case 15:
									_context.t2 = true;
									_context.next = _context.t2 === (openBet.event.BetDetail.OddTeamSide === 'Home' && eventResult.BinaryScore === '1-0') ? 18 : _context.t2 === (openBet.event.BetDetail.OddTeamSide === 'Away' && eventResult.BinaryScore === '0-1') ? 20 : _context.t2 === (eventResult.BinaryScore === '1-1') ? 22 : 24;
									break;

								case 18:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 26);

								case 20:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 26);

								case 22:
									openBet.wagerResult = 'tie';
									return _context.abrupt('break', 26);

								case 24:
									openBet.wagerResult = 'loss';
									return _context.abrupt('break', 26);

								case 26:
									return _context.abrupt('break', 69);

								case 27:
									HomeSpreadPoint = Number(eventResult.HomeScore).toFixed(2) - Number(eventResult.AwayScore).toFixed(2);
									AwaySpreadPoint = Number(eventResult.AwayScore).toFixed(2) - Number(eventResult.HomeScore).toFixed(2);
									_context.t3 = true;
									_context.next = _context.t3 === (HomeSpreadPoint >= 0 && openBet.event.BetDetail.OddPoint > 0 && openBet.event.BetDetail.OddTeamSide === 'Home') ? 32 : _context.t3 === (AwaySpreadPoint >= 0 && openBet.event.BetDetail.OddPoint > 0 && openBet.event.BetDetail.OddTeamSide === 'Away') ? 34 : _context.t3 === (HomeSpreadPoint > 0 && openBet.event.BetDetail.OddPoint >= 0 && openBet.event.BetDetail.OddTeamSide === 'Home') ? 36 : _context.t3 === (AwaySpreadPoint > 0 && openBet.event.BetDetail.OddPoint >= 0 && openBet.event.BetDetail.OddTeamSide === 'Away') ? 38 : _context.t3 === (openBet.event.BetDetail.OddPoint <= 0 && openBet.event.BetDetail.OddTeamSide === 'Home' && Number(eventResult.HomeScore).toFixed(2) + Number(openBet.event.BetDetail.OddPoint).toFixed(2) > Number(eventResult.AwayScore).toFixed(2)) ? 40 : _context.t3 === (openBet.event.BetDetail.OddPoint <= 0 && openBet.event.BetDetail.OddTeamSide === 'Away' && Number(eventResult.AwayScore).toFixed(2) + Number(openBet.event.BetDetail.OddPoint).toFixed(2) > Number(eventResult.HomeScore).toFixed(2)) ? 42 : _context.t3 === (HomeSpreadPoint === 0 && openBet.event.BetDetail.OddPoint === 0 && openBet.event.BetDetail.OddTeamSide === 'Home') ? 44 : _context.t3 === (AwaySpreadPoint === 0 && openBet.event.BetDetail.OddPoint === 0 && openBet.event.BetDetail.OddTeamSide === 'Away') ? 46 : _context.t3 === (openBet.event.BetDetail.OddPoint <= 0 && openBet.event.BetDetail.OddTeamSide === 'Home' && Number(eventResult.HomeScore).toFixed(2) + Number(openBet.event.BetDetail.OddPoint).toFixed(2) === Number(eventResult.AwayScore).toFixed(2)) ? 48 : _context.t3 === (openBet.event.BetDetail.OddPoint <= 0 && openBet.event.BetDetail.OddTeamSide === 'Away' && Number(eventResult.AwayScore).toFixed(2) + Number(openBet.event.BetDetail.OddPoint).toFixed(2) === Number(eventResult.HomeScore).toFixed(2)) ? 50 : 52;
									break;

								case 32:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 54);

								case 34:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 54);

								case 36:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 54);

								case 38:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 54);

								case 40:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 54);

								case 42:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 54);

								case 44:
									openBet.wagerResult = 'tie';
									return _context.abrupt('break', 54);

								case 46:
									openBet.wagerResult = 'tie';
									return _context.abrupt('break', 54);

								case 48:
									openBet.wagerResult = 'tie';
									return _context.abrupt('break', 54);

								case 50:
									openBet.wagerResult = 'tie';
									return _context.abrupt('break', 54);

								case 52:
									openBet.wagerResult = 'loss';
									return _context.abrupt('break', 54);

								case 54:
									return _context.abrupt('break', 69);

								case 55:
									TotalPoint = Number(eventResult.HomeScore) + Number(eventResult.AwayScore);
									_context.t4 = true;
									_context.next = _context.t4 === (openBet.event.BetDetail.OddTarget === 'Over' && openBet.event.BetDetail.OddPoint < TotalPoint) ? 59 : _context.t4 === (openBet.event.BetDetail.OddTarget === 'Under' && openBet.event.BetDetail.OddPoint > TotalPoint) ? 61 : _context.t4 === (openBet.event.BetDetail.OddPoint === TotalPoint) ? 63 : 65;
									break;

								case 59:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 67);

								case 61:
									openBet.wagerResult = 'won';
									return _context.abrupt('break', 67);

								case 63:
									openBet.wagerResult = 'tie';
									return _context.abrupt('break', 67);

								case 65:
									openBet.wagerResult = 'loss';
									return _context.abrupt('break', 67);

								case 67:
									return _context.abrupt('break', 69);

								case 68:
									return _context.abrupt('break', 69);

								case 69:
									openBet.orderStatus = 'completed';
									return _context.abrupt('break', 76);

								case 71:
									openBet.orderStatus = 'canceled';
									return _context.abrupt('break', 76);

								case 73:
									openBet.orderStatus = 'Postponed';
									return _context.abrupt('break', 76);

								case 75:
									return _context.abrupt('return');

								case 76:
									finalResult = new _StraightBetWagerResult2.default({
										betType: openBet.betType,
										agent: openBet.agent, // who is agent
										superAgent: openBet.superAgent,
										playerUsername: openBet.playerUsername,
										event: openBet.event,
										eventResult: eventResult,
										wagerResult: openBet.wagerResult, // won / loss / tie // cancelled
										orderStatus: openBet.orderStatus, // open / completed / cancelled
										orderTimePST: openBet.orderTimePST, // use PST
										finalConfirmTimePST: (0, _moment2.default)().unix()
									});
									_context.next = 79;
									return finalResult.save();

								case 79:
									_context.next = 81;
									return _StraightOpenBetWager2.default.findOneAndRemove({ _id: openBet._id });

								case 81:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, this);
				}));

				return function (_x, _x2) {
					return _ref.apply(this, arguments);
				};
			}())).then(function () {
				res.status(200);
			});
		}

		res.json('player has no open bets');
	});
});

exports.default = router;
//# sourceMappingURL=verifyStraightBetWagerResult.js.map