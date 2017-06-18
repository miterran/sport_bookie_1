'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _jwtStrategy = require('../middleware/jwtStrategy');

var _jwtStrategy2 = _interopRequireDefault(_jwtStrategy);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../data/config');

var _config2 = _interopRequireDefault(_config);

var _jsonSportArray = require('../data/jsonSportArray');

var _jsonSportArray2 = _interopRequireDefault(_jsonSportArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

_passport2.default.use(_jwtStrategy2.default);

var oddHeader = { "JsonOdds-API-Key": _config2.default.JSON_ODD_KEY };

var sortOddTypes = ["Game", "First Half", "Second Half", "First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter", "First Period", "Second Period", "Third Period", "First Five Innings", "First Inning"];
var sortSports = ['NBA', 'MLB', 'NCAAB', 'NCAAF', 'NFL', 'NHL', 'WNBA', 'SOCCER', 'TENNIS', 'BOXING', 'MMA', 'CRICKET', 'HORSE-RACING', 'KHL', 'AHL', 'SHL', 'HALL', 'LMP', 'NPB', 'KBO', 'GOLF', 'RUGBY', 'WBC'];

router.get('/fetch-all-leagues', _passport2.default.authenticate('jwt', { session: false }), function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
		var result, jsonOdds, jsonSportArray;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return (0, _nodeFetch2.default)('https://jsonodds.com/api/odds?source=3', { headers: oddHeader });

					case 2:
						result = _context.sent;
						_context.next = 5;
						return result.json();

					case 5:
						jsonOdds = _context.sent;
						jsonSportArray = _jsonSportArray2.default;


						jsonOdds.map(function (event, eventIdx) {
							jsonSportArray.map(function (sport, sportIdx) {
								if (sport.available) {
									if (event.Details) {
										if (Number(event.Sport) === Number(sport.jsonOddIndex)) {
											var addDetail = sport.leagueDetail.every(function (detail, detailIdx) {
												return Object.keys(detail)[0] !== event.Details;
											});
											if (addDetail) {
												var oddArr = [];
												event.Odds.map(function (oddtype, oddTypeIdx) {
													var addOdd = oddArr.every(function (odd, oddIdx) {
														return odd !== oddtype.OddType;
													});
													if (addOdd) {
														oddArr.push(oddtype.OddType);
													}
												});
												oddArr.sort(function (a, b) {
													return sortOddTypes.indexOf(a) - sortOddTypes.indexOf(b);
												});
												sport.leagueDetail.push(_defineProperty({}, event.Details, oddArr));
											}
										}
									}
								}
							});
						});

						jsonSportArray.sort(function (a, b) {
							return sortSports.indexOf(a.sport) - sortSports.indexOf(b.sport);
						});

						res.json(jsonSportArray);

					case 10:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

exports.default = router;
//# sourceMappingURL=fetchAllLeague.js.map