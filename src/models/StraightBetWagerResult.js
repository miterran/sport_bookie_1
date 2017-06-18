import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const StraightBetWagerResultSchema = mongoose.Schema({
	betType: String,
	agent: String,	// who is agent
	superAgent: String,
	playerUsername: String,
	event: Object,
	eventResult: Object,
	wagerResult: String, // won / loss / tie // cancelled
	orderStatus: String, // open / completed / cancelled
	orderTimePST: String, // use PST
	finalConfirmTimePST: String
});


const StraightBetWagerResult = mongoose.model('straightBetWagerResult', StraightBetWagerResultSchema);

export default StraightBetWagerResult;
