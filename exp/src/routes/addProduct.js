const db = require('../connections');
const uuid = require('uuid/v4');

module.exports = async (req, res) => {
  const product = {
    poId: req.params.poId,
    id: uuid(),
    name: req.body.name,
    description: req.body.description,
    qty: req.body.qty
  };
  await db.addProduct(product);
  res.send(product);
};
