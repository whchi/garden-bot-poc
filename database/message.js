const { mongoose } = require('./connector');

const MessageSchema = mongoose.Schema({
  payload: { type: String },
  uid: { type: String },
  user_status: { type: Number },
  order_type: { type: String },
  tx_id: { type: String, default: '' },
  type: { type: String },
  reply_token: { type: String },
  content: { type: String },
  created_at: { type: Date, default: Date.now() }
});
const message = mongoose.model('Message', MessageSchema);

module.exports = { message };
