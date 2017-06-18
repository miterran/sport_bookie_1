import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';

import JwtStrategy from '../middleware/jwtStrategy';
import passport from "passport";

passport.use(JwtStrategy);

import config from '../data/config';
const oddHeader = { "JsonOdds-API-Key": config.JSON_ODD_KEY };

router.post('/fetch-straight-odds', passport.authenticate('jwt', {session: false}), function(req, res){
	const querys = req.body
	const straightOddArr = []
	Promise.all(querys.map(async function(query, queryIdx){
		const result = await fetch(`https://jsonodds.com/api/odds/${query.sport}?source=8&oddType=${query.oddType.replace(/\s/g,'')}`, {headers: oddHeader})
		const odd = await result.json()
		if(odd.length > 0){
			odd.map(async function(event, eventIdx){
				if(event.Details === query.detail){
					straightOddArr.push(event)
				}
			})
		}else{
			const result = await fetch(`https://jsonodds.com/api/odds/${query.sport}?source=3&oddType=${query.oddType.replace(/\s/g,'')}`, {headers: oddHeader})
			const odd = await result.json()
			odd.map(async function(event, eventIdx){
				if(event.Details === query.detail){
					straightOddArr.push(event)
				}
			})
		}
	})).then(function(){


		straightOddArr.map(function(event, eventIdx){

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
			delete event.ID
			delete event.OddDetail.ID
			delete event.Odds;
			return event
		})
		res.json(straightOddArr)


	})

})

export default router