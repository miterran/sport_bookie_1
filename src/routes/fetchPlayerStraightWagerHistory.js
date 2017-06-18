import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';
import StraightBetWagerResult from '../models/StraightBetWagerResult';

import JwtStrategy from '../middleware/jwtStrategy';
import passport from "passport";

passport.use(JwtStrategy);

router.get('/fetch-player-straight-wager-history', passport.authenticate('jwt', {session: false}), function(req, res){
	StraightBetWagerResult.find({playerUsername: req.user.username}, function(err, result){
		res.json(result)
	})
})

export default router