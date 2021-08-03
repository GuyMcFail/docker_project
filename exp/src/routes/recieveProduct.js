const db = require('../connections');

module.exports = async (req, res) => {
    await db.recieveProduct(req.params.prodId);
    res.send('recieved');
};
