const { mongoose } = require('./connector');

const ProductOrderSchema = mongoose.Schema({
  contact: { type: String, index: true, unique: false, default: '' },
  product_info: { type: String, default: '' },
  nickname: { type: String, default: '' },
  consume_time: { type: String, default: '' },
  line_uid: { type: String, default: '' },
  tx_id: { type: String, index: true, unique: true },
  is_handle: { type: Boolean, default: false },
  status: { type: Number, default: 0 }, //0 => unpaid, 1 => paid, 2=>cancel
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date }
});
const productOrder = mongoose.model('ProductOrder', ProductOrderSchema);

const SeatOrderSchema = mongoose.Schema({
  contact: { type: String, index: true, unique: false, default: '' },
  nickname: { type: String, default: '' },
  consume_time: { type: String, default: '' },
  count: { type: Number, default: 0 },
  tx_id: { type: String, index: true, unique: true },
  line_uid: { type: String, default: '' },
  is_handle: { type: Boolean, default: false },
  status: { type: Number, default: 0 }, //0 => unpaid, 1 => paid, 2=>cancel
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date }
});
const seatOrder = mongoose.model('SeatOrder', SeatOrderSchema);

module.exports = { seatOrder, productOrder };
