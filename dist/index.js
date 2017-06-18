'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('./data/config');

var _config2 = _interopRequireDefault(_config);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _userRegister = require('./routes/userRegister');

var _userRegister2 = _interopRequireDefault(_userRegister);

var _userLogin = require('./routes/userLogin');

var _userLogin2 = _interopRequireDefault(_userLogin);

var _fetchAllLeague = require('./routes/fetchAllLeague');

var _fetchAllLeague2 = _interopRequireDefault(_fetchAllLeague);

var _fetchStraightOdds = require('./routes/fetchStraightOdds');

var _fetchStraightOdds2 = _interopRequireDefault(_fetchStraightOdds);

var _straightWagerSubmit = require('./routes/straightWagerSubmit');

var _straightWagerSubmit2 = _interopRequireDefault(_straightWagerSubmit);

var _fetchPlayerStraightOpenBetWager = require('./routes/fetchPlayerStraightOpenBetWager');

var _fetchPlayerStraightOpenBetWager2 = _interopRequireDefault(_fetchPlayerStraightOpenBetWager);

var _verifyStraightBetWagerResult = require('./routes/verifyStraightBetWagerResult');

var _verifyStraightBetWagerResult2 = _interopRequireDefault(_verifyStraightBetWagerResult);

var _fetchPlayerStraightWagerHistory = require('./routes/fetchPlayerStraightWagerHistory');

var _fetchPlayerStraightWagerHistory2 = _interopRequireDefault(_fetchPlayerStraightWagerHistory);

var _updatePlayerBalances = require('./routes/updatePlayerBalances');

var _updatePlayerBalances2 = _interopRequireDefault(_updatePlayerBalances);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
//import fetch from 'node-fetch';

_mongoose2.default.connect(_config2.default.MONGODB_URL);

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

app.use(_passport2.default.initialize());

// logger
app.use((0, _morgan2.default)('dev'));

// 3rd party middleware
app.use((0, _cors2.default)());

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.use(_express2.default.static(_path2.default.resolve(__dirname, '../client/build')));

// https://jsonodds.com/api/odds/${query.sport}?source=8&oddType=${query.oddType.replace(/\s/g,'')}`


// app.get('/test2', function(req, res){
// 	var options = {source: 8, sport: 'nba'};
// 	jsonOdds.getOdds(options, function(err, response, body) {
// 	  if (err) throw new Error(err);
// 	  res.json(body);
// 	});
// })


// console.log(moment().startOf('week').subtract(7, 'days'))
// console.log(moment().startOf('week'))
// console.log(moment().endOf('week'))


app.use('/api', _userRegister2.default);
app.use('/api', _userLogin2.default);
app.use('/api', _fetchAllLeague2.default);
app.use('/api', _fetchStraightOdds2.default);
app.use('/api', _straightWagerSubmit2.default);

app.use('/api', _fetchPlayerStraightOpenBetWager2.default);
app.use('/api', _fetchPlayerStraightWagerHistory2.default);

app.use('/api', _verifyStraightBetWagerResult2.default);

app.use('/api', _updatePlayerBalances2.default);

app.get('*', function (request, response) {
  response.sendFile(_path2.default.resolve(__dirname, '../client/build', 'index.html'));
});

app.server.listen(process.env.PORT || 8080, function () {
  console.log('Started on port ' + app.server.address().port);
});

exports.default = app;
//# sourceMappingURL=index.js.map