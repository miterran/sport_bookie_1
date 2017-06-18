import express from 'express';
const router = express.Router();
import moment from 'moment';
import StraightBetWagerResult from '../models/StraightBetWagerResult';
import StraightOpenBetWager from '../models/StraightOpenBetWager';

import fetch from 'node-fetch';

import JwtStrategy from '../middleware/JwtStrategy';
import passport from "passport";
passport.use(JwtStrategy);

import config from '../data/config';
const oddHeader = { "JsonOdds-API-Key": config.JSON_ODD_KEY };
//import jsonSportArr from '../data/jsonSportArray';
// const sortOddTypes = ["Game", "First Half", "Second Half", "First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter", "First Period", "Second Period", "Third Period", "First Five Innings", "First Inning"]
// const sortSports = ['NBA', 'MLB', 'NCAAB', 'NCAAF', 'NFL', 'NHL', 'WNBA', 'SOCCER', 'TENNIS', 'BOXING', 'MMA', 'CRICKET', 'HORSE-RACING', 'KHL', 'AHL', 'SHL', 'HALL', 'LMP', 'NPB', 'KBO', 'GOLF', 'RUGBY', 'WBC']


//, passport.authenticate('jwt', {session: false})

router.get('/verify-straight-bet-wager-result', passport.authenticate('jwt', {session: false}), function(req, res){
	StraightOpenBetWager.find({}, function(err, openBets){
		if(openBets.length > 0){
			Promise.all(openBets.map(async function(openBet, openBetIdx){
				const data = await fetch(`https://jsonodds.com/api/results/getbyeventid/${openBet.event.eventID}?oddType=${openBet.event.BetDetail.OddType}`, {headers: oddHeader})
				const result = await data.json()
				const eventResult = result[0]
				if(eventResult.Final === true){
					openBet.wagerResult = ''
					switch(eventResult.FinalType){
						case 'Finished':
							switch(openBet.event.BetDetail.BetType){
								case 'M Line':
									switch(true){
										case openBet.event.BetDetail.OddTeamSide === 'Home' && eventResult.BinaryScore === '1-0':
											openBet.wagerResult = 'won'
											break;
										case openBet.event.BetDetail.OddTeamSide === 'Away' && eventResult.BinaryScore === '0-1': 
											openBet.wagerResult = 'won'
											break;
										case eventResult.BinaryScore === '1-1': 
											openBet.wagerResult = 'tie'
											break;
										default:
											openBet.wagerResult = 'loss'
											break;
									}
									break;
								case 'Spread':
									const HomeSpreadPoint = Number(eventResult.HomeScore).toFixed(2) - Number(eventResult.AwayScore).toFixed(2)
									const AwaySpreadPoint = Number(eventResult.AwayScore).toFixed(2) - Number(eventResult.HomeScore).toFixed(2)
									switch(true){
										case HomeSpreadPoint >= 0 && openBet.event.BetDetail.OddPoint > 0 && openBet.event.BetDetail.OddTeamSide === 'Home':
											openBet.wagerResult = 'won'
											break;
										case AwaySpreadPoint >= 0 && openBet.event.BetDetail.OddPoint > 0 && openBet.event.BetDetail.OddTeamSide === 'Away':
											openBet.wagerResult = 'won'
											break;
										case HomeSpreadPoint > 0 && openBet.event.BetDetail.OddPoint >= 0 && openBet.event.BetDetail.OddTeamSide === 'Home':
											openBet.wagerResult = 'won'
											break;
										case AwaySpreadPoint > 0 && openBet.event.BetDetail.OddPoint >= 0 && openBet.event.BetDetail.OddTeamSide === 'Away':
											openBet.wagerResult = 'won'
											break;
										case openBet.event.BetDetail.OddPoint <= 0 && openBet.event.BetDetail.OddTeamSide === 'Home' && Number(eventResult.HomeScore).toFixed(2) + Number(openBet.event.BetDetail.OddPoint).toFixed(2) > Number(eventResult.AwayScore).toFixed(2):
											openBet.wagerResult = 'won'
											break;
										case openBet.event.BetDetail.OddPoint <= 0 && openBet.event.BetDetail.OddTeamSide === 'Away' && Number(eventResult.AwayScore).toFixed(2) + Number(openBet.event.BetDetail.OddPoint).toFixed(2) > Number(eventResult.HomeScore).toFixed(2):
											openBet.wagerResult = 'won'
											break;
										case HomeSpreadPoint === 0 && openBet.event.BetDetail.OddPoint === 0 && openBet.event.BetDetail.OddTeamSide === 'Home':
											openBet.wagerResult = 'tie'
											break;
										case AwaySpreadPoint === 0 && openBet.event.BetDetail.OddPoint === 0 && openBet.event.BetDetail.OddTeamSide === 'Away':
											openBet.wagerResult = 'tie'
											break;
										case openBet.event.BetDetail.OddPoint <= 0 && openBet.event.BetDetail.OddTeamSide === 'Home' && Number(eventResult.HomeScore).toFixed(2) + Number(openBet.event.BetDetail.OddPoint).toFixed(2) === Number(eventResult.AwayScore).toFixed(2):
											openBet.wagerResult = 'tie'
											break;
										case openBet.event.BetDetail.OddPoint <= 0 && openBet.event.BetDetail.OddTeamSide === 'Away' && Number(eventResult.AwayScore).toFixed(2) + Number(openBet.event.BetDetail.OddPoint).toFixed(2) === Number(eventResult.HomeScore).toFixed(2):
											openBet.wagerResult = 'tie'
											break;
										default:
											openBet.wagerResult = 'loss'
											break;
									}
									break;
								case 'Total':
									const TotalPoint = Number(eventResult.HomeScore) + Number(eventResult.AwayScore)
									switch(true){
										case openBet.event.BetDetail.OddTarget === 'Over' && openBet.event.BetDetail.OddPoint < TotalPoint :
											openBet.wagerResult = 'won'
											break;
										case openBet.event.BetDetail.OddTarget === 'Under' && openBet.event.BetDetail.OddPoint > TotalPoint:
											openBet.wagerResult = 'won'
											break;
										case openBet.event.BetDetail.OddPoint === TotalPoint:
											openBet.wagerResult = 'tie'
											break;
										default:
											openBet.wagerResult = 'loss'
											break;
									}
									break;
								default:
									break;
							}
							openBet.orderStatus = 'completed'
							break;
						case 'Canceled':
							openBet.orderStatus = 'canceled'
							break;
						case 'Postponed':
							openBet.orderStatus = 'Postponed'
							break;
						default:
							return
					}

					let finalResult = new StraightBetWagerResult({
						betType: openBet.betType,
						agent: openBet.agent,	// who is agent
						superAgent: openBet.superAgent,
						playerUsername: openBet.playerUsername,
						event: openBet.event,
						eventResult: eventResult,
						wagerResult: openBet.wagerResult, // won / loss / tie // cancelled
						orderStatus: openBet.orderStatus, // open / completed / cancelled
						orderTimePST: openBet.orderTimePST, // use PST
						finalConfirmTimePST: moment().unix()
					})
					await finalResult.save()
					await StraightOpenBetWager.findOneAndRemove({ _id: openBet._id})

				}

			})).then(function(){
				res.status(200)
			})
			
		}


		res.json('player has no open bets')
	})
})

export default router