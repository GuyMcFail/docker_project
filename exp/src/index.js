const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./connections');
const getPOs = require('./routes/getPos')
const addPO = require('./routes/addPo')
const orderPO = require('./routes/orderPo')
const addProduct = require('./routes/addProduct')
const getProducts = require('./routes/getProducts')
const recieveProduct = require('./routes/recieveProduct')

console.log('--USING TEST VAR--');
console.log(process.env.TEST_ENV_VAR);
console.log('/-USING TEST VAR-/');


app.use(cors())
app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

//get po list
app.get('/pos', getPOs);
app.post('/pos', addPO);
app.put('/pos/:id', orderPO);

//get products from po
app.get('/po-products/:poId', getProducts);
app.post('/po-products/:poId', addProduct);
app.put('/po-products/:prodId', recieveProduct);

app.get('/', (req, res) => {
  res.send('It is alive');
});

db.init().then(() => {
  app.listen(5000, () => console.log('Listening on port 5000'));
}).catch((err) => {
  console.error(err);
  process.exit(1);
})

const shutdown = () => {
  db.teardown()
  .catch((err) => {console.error(err)})
  .then(() => process.exit());
}
