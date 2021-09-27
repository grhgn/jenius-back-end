const redis = require("redis")

let { MongoClient, ObjectID } = require("mongodb");
let urlConnection = `mongodb+srv://user:213123asd@cluster0.xzudg.mongodb.net/crud-usesr?retryWrites=true&w=majority`;

var _db;
var redisClient;

module.exports = {

  connectToServer: function (callback) {
    MongoClient.connect(urlConnection, { useNewUrlParser: true, useUnifiedTopology: true, }, function (err, client) {
      _db = client.db("crud-user");

      const changeStream = client.db("crud-user").collection("crud-user").watch();
      // jika redis tidak include pada docker (redis diluar docker)
      redisClient = redis.createClient()
      // jika pakai redis dengan docker
      // docker dapat dijalankan pakai docker-compose up
      // redisClient = redis.createClient({ host: "redis", port: 6379 })

      console.log("Connected to MongoDB Server");
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },

  getRedis: function () {
    return redisClient;
  }
};