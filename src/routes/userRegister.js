import express from 'express';
import User from '../models/User';
const router = express.Router();


router.get('/user-register', (req, res) => {
	let newUser = new User({
		userStatus: 'player', // player / agent / superAgent / boss
		superAgent: 'superAgent', // who is super agent
		agent: 'agent',	// who is agent
		username: 'user2',
		password: '1234',
		passcode: '4321',
		email: '',
		phoneNumber: '',
		minBetAmount: 20,
		maxBetAmount: 2000,
		maxWinAmount: 5000,
		weeklyBalance: 100000,
		thisWeekBalance: 0,
		thisWeekLossAmount: 0,
		thisWeekWonAmount: 0,
		currentOpenBetAmount: 0,
		accountActive: true,
	});
	newUser.save().then(function(){
		console.log('saved')
		res.json({ accountCreated: true })
	})

})

export default router






