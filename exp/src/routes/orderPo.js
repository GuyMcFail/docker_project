const db = require('../connections');

module.exports = async (req, res) => {
    await db.orderPO(req.params.id);
    res.send('ordered');
};
