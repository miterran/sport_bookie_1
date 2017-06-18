import "babel-polyfill";
import path from 'path';
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
//import fetch from 'node-fetch';
import passport from "passport";


import config from './data/config';

import mongoose from 'mongoose'
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URL)

import moment from 'moment'

import userRegister from './routes/userRegister';
import userLogin from './routes/userLogin';
import fetchAllLeague from './routes/fetchAllLeague';
import fetchStraightOdds from './routes/fetchStraightOdds';
import straightWagerSubmit from './routes/straightWagerSubmit';
import fetchPlayerStraightOpenBetWager from './routes/fetchPlayerStraightOpenBetWager';
import verifyStraightBetWagerResult from './routes/verifyStraightBetWagerResult';
import fetchPlayerStraightWagerHistory from './routes/fetchPlayerStraightWagerHistory';

import updatePlayerBalances from './routes/updatePlayerBalances';


let app = express();
app.server = http.createServer(app);



app.use(passport.initialize());


// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../client/build')));





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



app.use('/api', userRegister)
app.use('/api', userLogin)
app.use('/api', fetchAllLeague)
app.use('/api', fetchStraightOdds)
app.use('/api', straightWagerSubmit)

app.use('/api', fetchPlayerStraightOpenBetWager)
app.use('/api', fetchPlayerStraightWagerHistory)

app.use('/api', verifyStraightBetWagerResult)

app.use('/api', updatePlayerBalances)

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.server.listen(process.env.PORT || 8080, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

export default app;