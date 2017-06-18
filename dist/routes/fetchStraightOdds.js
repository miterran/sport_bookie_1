'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _JwtStrategy = require('../middleware/JwtStrategy');

var _JwtStrategy2 = _interopRequireDefault(_JwtStrategy);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../data/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();


_passport2.default.use(_JwtStrategy2.default);

var oddHeader = { "JsonOdds-API-Key": _config2.default.JSON_ODD_KEY };

router.post('/fetch-straight-odds', _passport2.default.authenticate('jwt', { session: false }), function (req, res) {
	var querys = req.body;
	var straightOddArr = [];
	Promise.all(querys.map(function () {
		var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(query, queryIdx) {
			var result, odd, _result, _odd;

			return regeneratorRuntime.wrap(function _callee3$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							_context3.next = 2;
							return (0, _nodeFetch2.default)('https://jsonodds.com/api/odds/' + query.sport + '?source=8&oddType=' + query.oddType.replace(/\s/g, ''), { headers: oddHeader });

						case 2:
							result = _context3.sent;
							_context3.next = 5;
							return result.json();

						case 5:
							odd = _context3.sent;

							if (!(odd.length > 0)) {
								_context3.next = 10;
								break;
							}

							odd.map(function () {
								var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(event, eventIdx) {
									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													if (event.Details === query.detail) {
														straightOddArr.push(event);
													}

												case 1:
												case 'end':
													return _context.stop();
											}
										}
									}, _callee, this);
								}));

								return function (_x3, _x4) {
									return _ref2.apply(this, arguments);
								};
							}());
							_context3.next = 17;
							break;

						case 10:
							_context3.next = 12;
							return (0, _nodeFetch2.default)('https://jsonodds.com/api/odds/' + query.sport + '?source=3&oddType=' + query.oddType.replace(/\s/g, ''), { headers: oddHeader });

						case 12:
							_result = _context3.sent;
							_context3.next = 15;
							return _result.json();

						case 15:
							_odd = _context3.sent;

							_odd.map(function () {
								var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(event, eventIdx) {
									return regeneratorRuntime.wrap(function _callee2$(_context2) {
										while (1) {
											switch (_context2.prev = _context2.next) {
												case 0:
													if (event.Details === query.detail) {
														straightOddArr.push(event);
													}

												case 1:
												case 'end':
													return _context2.stop();
											}
										}
									}, _callee2, this);
								}));

								return function (_x5, _x6) {
									return _ref3.apply(this, arguments);
								};
							}());

						case 17:
						case 'end':
							return _context3.stop();
					}
				}
			}, _callee3, this);
		}));

		return function (_x, _x2) {
			return _ref.apply(this, arguments);
		};
	}())).then(function () {

		straightOddArr.map(function (event, eventIdx) {

			event.OddDetail = event.Odds[0];
			event.BetDetail = {};
			event.prevBetDetail = {};
			event.eventID = event.ID;
			event.WagerDetail = {
				BetAmountInput: '',
				BetWagerType: 'Wager',
				BetConfirm: false,
				estWinAmount: '0',
				estRiskAmount: '0',
				wagerMsg: '',
				errMsg: ''
			};
			delete event.ID;
			delete event.OddDetail.ID;
			delete event.Odds;
			return event;
		});
		res.json(straightOddArr);
	});
});

exports.default = router;
//# sourceMappingURL=fetchStraightOdds.js.map