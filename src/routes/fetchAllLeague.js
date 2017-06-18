import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';



import JwtStrategy from '../middleware/jwtStrategy';
import passport from "passport";
passport.use(JwtStrategy);

import config from '../data/config';
const oddHeader = { "JsonOdds-API-Key": config.JSON_ODD_KEY };

import jsonSportArr from '../data/jsonSportArray';

const sortOddTypes = ["Game", "First Half", "Second Half", "First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter", "First Period", "Second Period", "Third Period", "First Five Innings", "First Inning"]
const sortSports = ['NBA', 'MLB', 'NCAAB', 'NCAAF', 'NFL', 'NHL', 'WNBA', 'SOCCER', 'TENNIS', 'BOXING', 'MMA', 'CRICKET', 'HORSE-RACING', 'KHL', 'AHL', 'SHL', 'HALL', 'LMP', 'NPB', 'KBO', 'GOLF', 'RUGBY', 'WBC']

router.get('/fetch-all-leagues', passport.authenticate('jwt', {session: false}), async function(req, res){

	const result = await fetch('https://jsonodds.com/api/odds?source=3', {headers: oddHeader})
	const jsonOdds = await result.json()
	
	const jsonSportArray = jsonSportArr;

	jsonOdds.map(function(event, eventIdx){
		jsonSportArray.map(function(sport, sportIdx){
			if(sport.available){
				if(event.Details){
					if(Number(event.Sport) === Number(sport.jsonOddIndex)){
						let addDetail = sport.leagueDetail.every(function(detail, detailIdx){
							return Object.keys(detail)[0] !== event.Details
						})
						if(addDetail){
							let oddArr = []
							event.Odds.map(function(oddtype, oddTypeIdx){
								let addOdd = oddArr.every(function(odd, oddIdx){
									return odd !== oddtype.OddType
								})
								if(addOdd){
									oddArr.push(oddtype.OddType)
								}
								
							})
							oddArr.sort(function(a, b){
								return sortOddTypes.indexOf(a) - sortOddTypes.indexOf(b)
							})
							sport.leagueDetail.push({[event.Details]: oddArr})
						}
					}
				}
			}
		})
	})

	jsonSportArray.sort((a, b) => sortSports.indexOf(a.sport) - sortSports.indexOf(b.sport))

	res.json(jsonSportArray)

})

export default router


