import express from 'express';
import User from '../models/User';
const router = express.Router();

import jwt from 'jsonwebtoken';

router.post('/user-login', (req, res) => {
	User.findOne({username: req.body.username}, '_id userStatus username password email phoneNumber minBetAmount maxBetAmount maxWinAmount weeklyBalance thisWeekBalance thisWeekLossAmount thisWeekWonAmount lastWeekBalance lastWeekLossAmount lastWeekWonAmount currentOpenBetAmount', function(err, result){
		if(result){
			if(result.password == req.body.password){
				const token = jwt.sign({
					id: result._id,				
					userStatus: result.userStatus, 
					username: result.username,
					email: result.phoneNumber,
					phoneNumber: result.phoneNumber,
					minBetAmount: result.minBetAmount,
					maxBetAmount: result.maxBetAmount,
					maxWinAmount: result.maxWinAmount,
					weeklyBalance: result.weeklyBalance,
					thisWeekBalance: result.thisWeekBalance,
					thisWeekLossAmount: result.thisWeekLossAmount,
					thisWeekWonAmount: result.thisWeekWonAmount,
					lastWeekBalance: result.lastWeekBalance,
					lastWeekWonAmount: result.lastWeekWonAmount,
					lastWeekLossAmount: result.thisWeekLossAmount,
					currentOpenBetAmount: result.currentOpenBetAmount,
				}, 'diamond');
				return res.status(200).send(token)
			}else{
				return res.status(404).send('password not correct')
			}
		}else{
			return res.status(404).send('user not found')
		}
	})
})


export default router