import config from '../data/config';
import User from '../models/User';
import passport from "passport";
import passportJWT from "passport-jwt";
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;


let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = config.TOKEN_SECRET;


let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  User.findOne({username: jwt_payload.username}, 'userStatus username passcode agent superAgent email phoneNumber minBetAmount maxBetAmount maxWinAmount weeklyBalance thisWeekBalance thisWeekLossAmount thisWeekWonAmount lastWeekBalance lastWeekLossAmount lastWeekWonAmount currentOpenBetAmount', function(err, user){
    if(user){
      next(null, user);
    }else{
      next(null, false)
    }
  })
});

export default strategy