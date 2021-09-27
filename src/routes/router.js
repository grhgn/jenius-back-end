const user = require("./user");
const token = require("./token");

const router = {
    init(app) {
        app.use("", user);
        app.use("", token);
    },
};

module.exports = router;