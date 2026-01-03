const app = require('../server');
const connectDB = require('../config/db');

let ready = false;

module.exports = async (req, res) => {
    if (!ready) {
        await connectDB();
        ready = true;
    }
    return app(req, res);
};
