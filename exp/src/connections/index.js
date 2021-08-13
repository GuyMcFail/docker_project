const waitPort = require('wait-port')
const fs = require('fs');
const mysql = require('mysql');

let pool;

async function init() {
    const host = process.env.MYSQL_HOST;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DB;

    await waitPort({ host, port : 3306});

    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
    });

    return new Promise((acc, rej) => {
      pool.getConnection(function (err, conn) {
        if (err) return rej(err);

        conn.query('CREATE TABLE IF NOT EXISTS pos (id int(10) unsigned AUTO_INCREMENT, vendor varchar(3), ordered boolean, orderDate date, PRIMARY KEY (id))',
        function (err, rows) {
          if (err) throw err;

          conn.query('CREATE TABLE IF NOT EXISTS products (poId int(10) unsigned NOT NULL, prodId varchar(36) NOT NULL, prodName varchar(255), prodDescription varchar(255), qty int(11), recieved boolean DEFAULT false)', function (err, rows) {
            if (err) throw err;

            console.log(`Connected to mysql db at host ${host} + created Tables`);
            conn.release();
            acc();
          });
        });
      });



        /*pool.query(
            'CREATE TABLE IF NOT EXISTS pos (id int(10) unsigned, vendor varchar(3), ordered boolean, orderDate date)',
            err => {
                if (err) return rej(err);

                console.log(`Connected to mysql db at host ${host}`);
                acc();
            },
        );*/

    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        pool.end(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getPos() {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM pos', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(order =>
                    Object.assign({}, order, {
                        ordered: order.ordered === 1,
                    }),
                ),
            );
        });
    });
}

async function addPo(po){
  console.log('attempting to add po');
  return new Promise((acc, rej) => {
    pool.query('INSERT INTO pos (vendor) VALUES (?)',
      [po.vendor],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

async function orderPO(id){
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  return new Promise((acc, rej) => {
    pool.query('UPDATE pos SET ordered=?, orderDate=? WHERE id=?',
      [true, date, id],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

async function addProduct(product){
  console.log('attempting to add po');
  return new Promise((acc, rej) => {
    pool.query('INSERT INTO products (poId, prodId, prodName, prodDescription, qty) VALUES (?, ?, ?, ?, ?)',
      [
        product.poId,
        product.id,
        product.name,
        product.description,
        product.qty,
      ],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

async function getProducts(poId) {
    return new Promise((acc, rej) => {
        pool.query('SELECT prodId, prodName, prodDescription, qty, recieved FROM products WHERE poId=?',
        [poId],
         (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(order =>
                    Object.assign({}, order, {
                        recieved: order.recieved === 1,
                    }),
                ),
            );
        });
    });
}

async function recieveProduct(id){
  return new Promise((acc, rej) => {
    pool.query('UPDATE products SET recieved=? WHERE prodId=?',
      [true, id],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

module.exports = {
    init,
    teardown,
    getPos,
    addPo,
    orderPO,
    addProduct,
    getProducts,
    recieveProduct
};
