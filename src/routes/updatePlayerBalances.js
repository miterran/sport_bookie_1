import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';
import moment from 'moment';
import _ from 'lodash';
import StraightOpenBetWager from '../models/StraightOpenBetWager';
import StraightBetWagerResult from '../models/StraightBetWagerResult';
import User from '../models/User';

import JwtStrategy from '../middleware/jwtStrategy';
import passport from "passport";

passport.use(JwtStrategy);

router.get('/update-player-balances', passport.authenticate('jwt', {session: false}), function(req, res){
	let thisWeeklyBalance = 0;
	let thisWeekWonAmount = 0;
	let thisWeekLossAmount = 0;
	let currentOpenBetAmount = 0;

	StraightBetWagerResult.find({playerUsername: req.user.username, finalConfirmTimePST: { $gt: moment().startOf('week').unix(), $lt: moment().endOf('week').unix() }}, function(err, result){
		if(result.length > 0){
			result.map(function(history, historyIdx){
				switch(history.wagerResult){
					case 'won':
						thisWeekWonAmount += history.event.WagerDetail.estWinAmount;
						break;
					case 'loss':
						thisWeekLossAmount -= history.event.WagerDetail.estRiskAmount;
					default:
						return;
				}
			})
		}

		StraightOpenBetWager.find({playerUsername: req.user.username}, function(err, result){
			if(result.length > 0){
				result.map(function(openBet, openBetIdx){
					console.log(currentOpenBetAmount)
					currentOpenBetAmount += Number(openBet.event.WagerDetail.estRiskAmount)
				})
			}

			thisWeeklyBalance = req.user.weeklyBalance + thisWeekWonAmount + thisWeekLossAmount - currentOpenBetAmount
			User.findOneAndUpdate({username: req.user.username}, 
				{ '$set': { 
					currentOpenBetAmount: currentOpenBetAmount,
					thisWeekBalance: thisWeeklyBalance, 
					thisWeekWonAmount: thisWeekWonAmount,
					thisWeekLossAmount: thisWeekLossAmount
				} }
				, {new: true}, function(err, result){

				res.json(result)
			})
		})
	})





})


router.get('/update-player-status', passport.authenticate('jwt', {session: false}), (req, res) => {
	User.find({username: req.user.username}, 'userStatus username passcode agent superAgent email phoneNumber minBetAmount maxBetAmount maxWinAmount weeklyBalance thisWeekBalance thisWeekLossAmount thisWeekWonAmount lastWeekBalance lastWeekLossAmount lastWeekWonAmount currentOpenBetAmount',function(err, result){
		let latestPlayerStatus = result[0]
		latestPlayerStatus.passcode = undefined

		res.json(latestPlayerStatus)
	})
})


export default router




//console.log(moment().startOf('week').subtract(7, 'days'))
// console.log(moment().startOf('week'))
// console.log(moment().endOf('week'))


	// User.findOneAndUpdate({username: req.body.username}, function(err, result){

	// })