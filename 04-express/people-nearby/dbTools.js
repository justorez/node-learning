const MongoClient = require('mongodb').MongoClient;
let tool = {};

const url = 'mongodb://leo:leomongo@localhost:27017';
const dbName = 'test';

function _connect(callback) {
  MongoClient.connect(url, {useUnifiedTopology: true}, 
    (err, client) => {
      callback(client);
  });
}

// 初始化
_connect(function (client) {
  let c = client.db(dbName).collection('heros');
  c.createIndex({'sp': '2dsphere'}, () => client.close());
});

tool.insert = function(c_name, dataArr, fn) {
  _connect(client => {
    let c = client.db(dbName).collection(c_name);
    c.insertMany(dataArr, (err, results) => {
      fn(err, results);
      client.close();
    });
  });
}

tool.find = function(c_name, filter, fn) {
  _connect(client => {
    let c = client.db(dbName).collection(c_name);
    c.find(filter).toArray((err, documents) => {
      fn(err, documents);
      client.close();
    });
  });
}

tool.deleteAll = function(c_name, fn) {
  _connect(client => {
    let c = client.db(dbName).collection(c_name);
    c.deleteMany({}, (err, result) => {
      fn(err, result);
      client.close();
    });
  });
}

tool.findNear = function(c_name, filter, fn) {
  _connect(client => {
    let c = client.db(dbName).collection(c_name);
    c.aggregate({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [filter.l, filter.r]
        },
        distanceField: "dist.calculated",
        spherical: true,
        // maxDistance: 10000000,
        // query:filter
      }
    }, (error, cursor) => {
      if (error) throw error;
      cursor.toArray((err, documents) => {
        fn(err, documents);
        client.close();
      })
    })
  });
}

tool.update = function(c_name, filter, updated, fn) {
  _connect(client => {
    let c = client.db(dbName).collection(c_name);
    c.updateMany(filter, {$set:updated}, (err, result) => {
      client.close();
      fn(err, result);
    });
  });
}

module.exports = tool;
