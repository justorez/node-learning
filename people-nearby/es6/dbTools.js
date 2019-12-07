const MongoClient = require('mongodb').MongoClient;
let tool = {};

const url = 'mongodb://leo:leomongo@localhost:27017';
const dbName = 'test';
let client = null;

tool.open = async () => {
  if (!client) {
    client = new MongoClient(url, {useUnifiedTopology: true});
    await client.connect();
  }
}

tool.close = () => {
  if (client) {
    client.close();
  }
}

const _getCollection = (c_name) => {
  return client.db(dbName).collection(c_name);
}

tool.insert = async (c_name, dataArr, fn) => {
  let col = _getCollection(c_name);
  return await col.insertMany(dataArr);
}

tool.find = async (c_name, filter, fn) => {
  let col = _getCollection(c_name);
  return await col.find(filter).toArray();
}

tool.findNear = (c_name, filter, fn) => {
  let col = _getCollection(c_name);
  let cursor = await col.aggregate({
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
  });
  return cursor.toArray();
}

tool.deleteAll = async (c_name, fn) => {
  let col = _getCollection(c_name);
  return await col.deleteMany({});
}

tool.update = async (c_name, filter, updated, fn) => {
  let col = _getCollection(c_name);
  return await col.updateMany(filter, {$set:updated});
}

module.exports = tool;
