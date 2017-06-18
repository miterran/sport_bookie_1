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

var _config = require('../data/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

_passport2.default.use(_JwtStrategy2.default);

var sportId = ['MLB', 'NBA', 'NCAAB', 'NCAAF', 'NFL', 'NHL', 'unknowSport', 'SOCCER', 'WNBA', 'TENNIS', 'BOXING', 'MMA', 'CRICKET', 'HORSE-RACING', 'KHL', 'AHL', 'SHL', 'HALL', 'LMP', 'NPB', 'KBO', 'GOLF', 'RUGBY', 'WBC'];

var oddHeader = { 'JsonOdds-API-Key': _config2.default.JSON_ODD_KEY, 'Content-Type': 'application/x-www-form-urlencoded' };

router.post('/straight-wager-submit', _passport2.default.authenticate('jwt', { session: false }), function (req, res) {
	if (req.body.passcode === req.user.passcode) {
		var wagerSubmit = req.body.wagerSubmit;
		var latestStraightOddArr = [];

		Promise.all(wagerSubmit.map(function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(wager, wagerIdx) {
				var result, odd, latestWager, newOdd;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return (0, _nodeFetch2.default)('https://jsonodds.com/api/odds/bygames', { method: 'POST', body: 'GameIDs=' + wager.eventID + '&Source=' + wager.BetDetail.SiteID + '&Sport=' + sportId[wager.Sport] + '&OddType=' + wager.BetDetail.OddType, headers: oddHeader });

							case 2:
								result = _context.sent;
								_context.next = 5;
								return result.json();

							case 5:
								odd = _context.sent;
								latestWager = wager;

								latestWager.prevBetDetail = wager.BetDetail;
								latestWager.BetDetail = {};

								if (!(odd.length > 0)) {
									_context.next = 74;
									break;
								}

								newOdd = odd[0];

								newOdd.OddDetail = newOdd.Odds[0];
								delete newOdd.Odds[0];

								_context.t0 = true;
								_context.next = _context.t0 === (latestWager.prevBetDetail.BetType === 'M Line' && latestWager.prevBetDetail.OddTeamSide === 'Home') ? 16 : _context.t0 === (latestWager.prevBetDetail.BetType === 'M Line' && latestWager.prevBetDetail.OddTeamSide === 'Away') ? 25 : _context.t0 === (latestWager.prevBetDetail.BetType === 'Spread' && latestWager.prevBetDetail.OddTeamSide === 'Home') ? 34 : _context.t0 === (latestWager.prevBetDetail.BetType === 'Spread' && latestWager.prevBetDetail.OddTeamSide === 'Away') ? 43 : _context.t0 === (latestWager.prevBetDetail.BetType === 'Total' && latestWager.prevBetDetail.OddTarget === 'Over') ? 52 : _context.t0 === (latestWager.prevBetDetail.BetType === 'Total' && latestWager.prevBetDetail.OddTarget === 'Under') ? 61 : 70;
								break;

							case 16:
								latestWager.BetDetail.OddType = newOdd.OddDetail.OddType;
								latestWager.BetDetail.BetType = 'M Line';
								latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID;
								latestWager.BetDetail.OddTarget = newOdd.HomeTeam;
								latestWager.BetDetail.OddPoint = '';
								latestWager.BetDetail.OddLine = newOdd.OddDetail.MoneyLineHome;
								latestWager.BetDetail.OddTeamSide = 'Home';
								latestWager.BetDetail.Pitcher = newOdd.HomePitcher;
								return _context.abrupt('break', 71);

							case 25:
								latestWager.BetDetail.OddType = newOdd.OddDetail.OddType;
								latestWager.BetDetail.BetType = 'M Line';
								latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID;
								latestWager.BetDetail.OddTarget = newOdd.AwayTeam;
								latestWager.BetDetail.OddPoint = '';
								latestWager.BetDetail.OddLine = newOdd.OddDetail.MoneyLineAway;
								latestWager.BetDetail.OddTeamSide = 'Away';
								latestWager.BetDetail.Pitcher = newOdd.AwayPitcher;
								return _context.abrupt('break', 71);

							case 34:
								latestWager.BetDetail.OddType = newOdd.OddDetail.OddType;
								latestWager.BetDetail.BetType = 'Spread';
								latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID;
								latestWager.BetDetail.OddTarget = newOdd.HomeTeam;
								latestWager.BetDetail.OddPoint = newOdd.OddDetail.PointSpreadHome;
								latestWager.BetDetail.OddLine = newOdd.OddDetail.PointSpreadHomeLine;
								latestWager.BetDetail.OddTeamSide = 'Home';
								latestWager.BetDetail.Pitcher = newOdd.HomePitcher;
								return _context.abrupt('break', 71);

							case 43:
								latestWager.BetDetail.OddType = newOdd.OddDetail.OddType;
								latestWager.BetDetail.BetType = 'Spread';
								latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID;
								latestWager.BetDetail.OddTarget = newOdd.AwayTeam;
								latestWager.BetDetail.OddPoint = newOdd.OddDetail.PointSpreadAway;
								latestWager.BetDetail.OddLine = newOdd.OddDetail.PointSpreadAwayLine;
								latestWager.BetDetail.OddTeamSide = 'Away';
								latestWager.BetDetail.Pitcher = newOdd.AwayPitcher;
								return _context.abrupt('break', 71);

							case 52:
								latestWager.BetDetail.OddType = newOdd.OddDetail.OddType;
								latestWager.BetDetail.BetType = 'Total';
								latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID;
								latestWager.BetDetail.OddTarget = 'Over';
								latestWager.BetDetail.OddPoint = newOdd.OddDetail.TotalNumber;
								latestWager.BetDetail.OddLine = newOdd.OddDetail.OverLine;
								latestWager.BetDetail.OddTeamSide = '';
								latestWager.BetDetail.Pitcher = '';
								return _context.abrupt('break', 71);

							case 61:
								latestWager.BetDetail.OddType = newOdd.OddDetail.OddType;
								latestWager.BetDetail.BetType = 'Total';
								latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID;
								latestWager.BetDetail.OddTarget = 'Under';
								latestWager.BetDetail.OddPoint = newOdd.OddDetail.TotalNumber;
								latestWager.BetDetail.OddLine = newOdd.OddDetail.UnderLine;
								latestWager.BetDetail.OddTeamSide = '';
								latestWager.BetDetail.Pitcher = '';
								return _context.abrupt('break', 71);

							case 70:
								return _context.abrupt('break', 71);

							case 71:
								latestStraightOddArr.push(latestWager);
								_context.next = 75;
								break;

							case 74:
								latestStraightOddArr.push(latestWager);

							case 75:
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
			var allOddsAreUpToDate = latestStraightOddArr.every(function (event) {
				return JSON.stringify(event.BetDetail) === JSON.stringify(event.prevBetDetail);
			});
			if (allOddsAreUpToDate) {
				Promise.all(latestStraightOddArr.map(function () {
					var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(event, eventIdx) {
						var newStraightOpenBet;
						return regeneratorRuntime.wrap(function _callee2$(_context2) {
							while (1) {
								switch (_context2.prev = _context2.next) {
									case 0:
										delete event.prevBetDetail;
										newStraightOpenBet = new _StraightOpenBetWager2.default({
											betType: 'straight',
											agent: req.user.agent, // who is agent
											superAgent: req.user.superAgent,
											playerUsername: req.user.username,
											event: event,
											orderStatus: 'open', // open / cancelled
											orderTimePST: (0, _moment2.default)().unix // use 0 UTC
											() });
										_context2.next = 4;
										return newStraightOpenBet.save();

									case 4:
									case 'end':
										return _context2.stop();
								}
							}
						}, _callee2, this);
					}));

					return function (_x3, _x4) {
						return _ref2.apply(this, arguments);
					};
				}())).then(function () {
					res.json({ type: 'SERVER_OPEN_BET_SAVED' });
				});
			} else {
				latestStraightOddArr.map(function (event, eventIdx) {
					if (!_lodash2.default.isEmpty(event.BetDetail) && !_lodash2.default.isEmpty(event.prevBetDetail)) {
						if (JSON.stringify(event.BetDetail) === JSON.stringify(event.prevBetDetail)) {
							delete event.prevBetDetail;
						} else {
							event.WagerDetail = {
								BetAmountInput: '',
								BetWagerType: 'Wager',
								BetConfirm: false,
								estWinAmount: '0',
								estRiskAmount: '0',
								wagerMsg: '',
								errMsg: 'wager has changed'
							};
						}
					} else if (_lodash2.default.isEmpty(event.BetDetail)) {
						event.WagerDetail = {
							BetAmountInput: '',
							BetWagerType: 'Wager',
							BetConfirm: false,
							estWinAmount: '0',
							estRiskAmount: '0',
							wagerMsg: '',
							errMsg: 'event has been started, remove it'
						};
					}
					return event;
				});
				res.json({ type: 'SERVER_LATEST_ODD_UPDATE', payload: latestStraightOddArr });
			}
		});
	} else {
		res.json({ type: 'SERVER_PASSCODE_NOT_MATCH', msg: 'passcode not match' });
	}
});

exports.default = router;
//# sourceMappingURL=straightWagerSubmit.js.map