import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
	userStatus: String, // player / agent / superAgent / boss
	superAgent: String, // who is super agent
	agent: String,	// who is agent
	username: String,
	password: String,
	passcode: String,
	email: String,
	phoneNumber: String,
	minBetAmount: Number,
	maxBetAmount: Number,
	maxWinAmount: Number,
	weeklyBalance: Number,
	thisWeekBalance: Number,
	thisWeekLossAmount: Number,
	thisWeekWonAmount: Number,
	lastWeekBalance: Number,
	lastWeekLossAmount: Number,
	lastWeekWonAmount: Number,
	currentOpenBetAmount: Number,
	accountActive: Boolean,
});


const User = mongoose.model('user', UserSchema);

export default User;
