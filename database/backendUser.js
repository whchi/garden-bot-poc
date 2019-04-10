const { mongoose } = require('./connector');

const BackendUserSchema = mongoose.Schema({
  name: { type: String, index: true, unique: false },
  account: { type: String, index: true, unique: true },
  password: { type: String },
  // 0 => admin, 1 => general
  type: { type: Number, default: 1 }
});
const backendUser = mongoose.model('BackendUser', BackendUserSchema);

module.exports = { backendUser };
