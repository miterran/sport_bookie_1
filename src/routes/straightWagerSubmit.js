import express from 'express';
const router = express.Router();
import _ from 'lodash';
import fetch from 'node-fetch';
import moment from 'moment';
import JwtStrategy from '../middleware/JwtStrategy';
import passport from "passport";
import StraightOpenBetWager from '../models/StraightOpenBetWager';
passport.use(JwtStrategy);

const sportId = ['MLB', 'NBA', 'NCAAB', 'NCAAF', 'NFL', 'NHL', 'unknowSport', 'SOCCER', 'WNBA', 'TENNIS', 'BOXING', 'MMA', 'CRICKET', 'HORSE-RACING', 'KHL', 'AHL', 'SHL', 'HALL', 'LMP', 'NPB', 'KBO', 'GOLF', 'RUGBY', 'WBC'];

import config from '../data/config';
const oddHeader = { 'JsonOdds-API-Key': config.JSON_ODD_KEY, 'Content-Type': 'application/x-www-form-urlencoded' };

router.post('/straight-wager-submit', passport.authenticate('jwt', {session: false}), function(req, res){
	if(req.body.passcode === req.user.passcode){
		const wagerSubmit = req.body.wagerSubmit;
		const latestStraightOddArr = [];

		Promise.all(wagerSubmit.map(async function(wager, wagerIdx){
			const result = await fetch('https://jsonodds.com/api/odds/bygames', {method: 'POST', body: `GameIDs=${wager.eventID}&Source=${wager.BetDetail.SiteID}&Sport=${sportId[wager.Sport]}&OddType=${wager.BetDetail.OddType}`, headers: oddHeader})
			const odd = await result.json();
			const latestWager = wager
			latestWager.prevBetDetail = wager.BetDetail
			latestWager.BetDetail = {}

			if(odd.length > 0){
				const newOdd = odd[0]
				newOdd.OddDetail = newOdd.Odds[0]
				delete newOdd.Odds[0]

				switch(true){
					case latestWager.prevBetDetail.BetType === 'M Line' && latestWager.prevBetDetail.OddTeamSide === 'Home':
						latestWager.BetDetail.OddType = newOdd.OddDetail.OddType
						latestWager.BetDetail.BetType = 'M Line'
						latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID
						latestWager.BetDetail.OddTarget = newOdd.HomeTeam
						latestWager.BetDetail.OddPoint = ''
						latestWager.BetDetail.OddLine = newOdd.OddDetail.MoneyLineHome
						latestWager.BetDetail.OddTeamSide = 'Home'
						latestWager.BetDetail.Pitcher = newOdd.HomePitcher
						break;
					case latestWager.prevBetDetail.BetType === 'M Line' && latestWager.prevBetDetail.OddTeamSide === 'Away':
						latestWager.BetDetail.OddType = newOdd.OddDetail.OddType
						latestWager.BetDetail.BetType = 'M Line'
						latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID
						latestWager.BetDetail.OddTarget = newOdd.AwayTeam
						latestWager.BetDetail.OddPoint = ''
						latestWager.BetDetail.OddLine = newOdd.OddDetail.MoneyLineAway
						latestWager.BetDetail.OddTeamSide = 'Away'
						latestWager.BetDetail.Pitcher = newOdd.AwayPitcher
						break;
					case latestWager.prevBetDetail.BetType === 'Spread' && latestWager.prevBetDetail.OddTeamSide === 'Home':
						latestWager.BetDetail.OddType = newOdd.OddDetail.OddType
						latestWager.BetDetail.BetType = 'Spread'
						latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID
						latestWager.BetDetail.OddTarget = newOdd.HomeTeam
						latestWager.BetDetail.OddPoint = newOdd.OddDetail.PointSpreadHome
						latestWager.BetDetail.OddLine = newOdd.OddDetail.PointSpreadHomeLine
						latestWager.BetDetail.OddTeamSide = 'Home'
						latestWager.BetDetail.Pitcher = newOdd.HomePitcher
						break;
					case latestWager.prevBetDetail.BetType === 'Spread' && latestWager.prevBetDetail.OddTeamSide === 'Away':
						latestWager.BetDetail.OddType = newOdd.OddDetail.OddType
						latestWager.BetDetail.BetType = 'Spread'
						latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID
						latestWager.BetDetail.OddTarget = newOdd.AwayTeam
						latestWager.BetDetail.OddPoint = newOdd.OddDetail.PointSpreadAway
						latestWager.BetDetail.OddLine = newOdd.OddDetail.PointSpreadAwayLine
						latestWager.BetDetail.OddTeamSide = 'Away'
						latestWager.BetDetail.Pitcher = newOdd.AwayPitcher
						break;
					case latestWager.prevBetDetail.BetType === 'Total' && latestWager.prevBetDetail.OddTarget === 'Over':
						latestWager.BetDetail.OddType = newOdd.OddDetail.OddType
						latestWager.BetDetail.BetType = 'Total'
						latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID
						latestWager.BetDetail.OddTarget = 'Over'
						latestWager.BetDetail.OddPoint = newOdd.OddDetail.TotalNumber
						latestWager.BetDetail.OddLine = newOdd.OddDetail.OverLine
						latestWager.BetDetail.OddTeamSide = ''
						latestWager.BetDetail.Pitcher = ''
						break;
					case latestWager.prevBetDetail.BetType === 'Total' && latestWager.prevBetDetail.OddTarget === 'Under':
						latestWager.BetDetail.OddType = newOdd.OddDetail.OddType
						latestWager.BetDetail.BetType = 'Total'
						latestWager.BetDetail.SiteID = newOdd.OddDetail.SiteID
						latestWager.BetDetail.OddTarget = 'Under'
						latestWager.BetDetail.OddPoint = newOdd.OddDetail.TotalNumber
						latestWager.BetDetail.OddLine = newOdd.OddDetail.UnderLine
						latestWager.BetDetail.OddTeamSide = ''
						latestWager.BetDetail.Pitcher = ''
						break;
					default:
						break;
				}
				latestStraightOddArr.push(latestWager)
			}else{
				latestStraightOddArr.push(latestWager)
			}
		})).then(function(){
			const allOddsAreUpToDate = latestStraightOddArr.every((event) => JSON.stringify(event.BetDetail) === JSON.stringify(event.prevBetDetail))
			if(allOddsAreUpToDate){
				Promise.all(latestStraightOddArr.map(async function(event, eventIdx){
					delete event.prevBetDetail
					let newStraightOpenBet = new StraightOpenBetWager({
						betType: 'straight',
						agent: req.user.agent,	// who is agent
						superAgent: req.user.superAgent,
						playerUsername: req.user.username,
						event: event,
						orderStatus: 'open', // open / cancelled
						orderTimePST: moment().unix() // use 0 UTC
					});
					await newStraightOpenBet.save()
				})).then(function(){
					res.json({type: 'SERVER_OPEN_BET_SAVED'})
				})
			}else{
				latestStraightOddArr.map(function(event, eventIdx){
					if(!_.isEmpty(event.BetDetail) && !_.isEmpty(event.prevBetDetail)){
						if(JSON.stringify(event.BetDetail) === JSON.stringify(event.prevBetDetail)){
							delete event.prevBetDetail
						}else{
							event.WagerDetail = {
								BetAmountInput: '', 
								BetWagerType: 'Wager', 
								BetConfirm: false, 
								estWinAmount: '0', 
								estRiskAmount: '0',
								wagerMsg: '', 
								errMsg: 'wager has changed'
							};
						}
					}else if(_.isEmpty(event.BetDetail)){
						event.WagerDetail = {
							BetAmountInput: '', 
							BetWagerType: 'Wager', 
							BetConfirm: false, 
							estWinAmount: '0', 
							estRiskAmount: '0',
							wagerMsg: '', 
							errMsg: 'event has been started, remove it'
						};
					}
					return event
				})
				res.json({type: 'SERVER_LATEST_ODD_UPDATE', payload: latestStraightOddArr})
			}
		})
	}else{
		res.json({type: 'SERVER_PASSCODE_NOT_MATCH', msg: 'passcode not match'})
	}
})

export default router

