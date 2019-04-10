const { mongoose } = require('./connector');

const ProductSchema = mongoose.Schema({
  title: { type: String },
  url: { type: String },
  desc: { type: String },
  img: { type: String },
  points: { type: Number },
  type: { type: Number }
});
const product = mongoose.model('Product', ProductSchema);

module.exports = { product };
