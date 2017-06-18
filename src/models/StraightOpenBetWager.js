import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const StraightOpenBetWagerSchema = mongoose.Schema({
	betType: String,
	agent: String,	// who is agent
	superAgent: String,
	playerUsername: String,
	event: Object,
	orderStatus: String, // open / completed / cancelled
	orderTimePST: String // use PST
});


const StraightOpenBetWager = mongoose.model('straightOpenBetWager', StraightOpenBetWagerSchema);

export default StraightOpenBetWager;
