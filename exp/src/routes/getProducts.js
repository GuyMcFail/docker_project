const db = require('../connections');

module.exports = async(req, res) => {
  const products = await db.getProducts(req.params.poId);
  res.send(products);
};
