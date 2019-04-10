const { mongoose } = require('./connector');

const MemberSchema = mongoose.Schema({
  name: { type: String, index: { unique: false } },
  account: { type: String, index: { unique: true } },
  password: { type: String },
  points: { type: Number, default: 5000 },
  line_uid: { type: String, default: '' },
  line_data: { type: String, default: '' },
});
const member = mongoose.model('Member', MemberSchema);

module.exports = { member };
