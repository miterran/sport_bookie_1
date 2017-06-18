import express from 'express';
const router = express.Router();
import _ from 'lodash';
import fetch from 'node-fetch';
import moment from 'moment';
import JwtStrategy from '../middleware/jwtStrategy';
import passport from "passport";
import StraightOpenBetWager from '../models/StraightOpenBetWager';
passport.use(JwtStrategy);


router.get('/fetch-player-straight-openbet-wager', passport.authenticate('jwt', {session: false}), function(req, res){
	StraightOpenBetWager.find({playerUsername: req.user.username}, function(err, result){
		res.json(result)
	})
})

export default router