const db = require('../connections');

module.exports = async(req, res) => {
  const orders = await db.getPos();
  res.send(orders);
};
