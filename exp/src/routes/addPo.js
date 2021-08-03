const db = require('../connections');

module.exports = async (req, res) => {
  console.log('--REQUEST--: ');
  console.log(req.body);
  console.log('/--REQUEST--/');
  const order = {
    vendor: req.body.vendor,
  };
  await db.addPo(order);
  res.send(order);
};
