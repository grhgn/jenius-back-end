const express = require("express");
const cors = require("cors");
const database = require('./src/config/database.js');

database.connectToServer(function (err) {

    const router = require('./src/routes/router.js');

    if (err) console.log(err);
    const PORT = 3000;

    const db = database.getDb()
    const redis = database.getRedis()

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.set('view engine', 'ejs');

    router.init(app);

    redis.on('connect', function(){
        console.log("Connected to redis....")
    })
    app.listen(PORT, () => {
        console.log(`app listening on port ${PORT}`);
    });
    
});
