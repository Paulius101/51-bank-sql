const db = require('./db');
const Bank = require('./Bank');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const conn = await db.init({
        host: 'localhost',
        user: 'root',
        database: 'bank',
    });

    // LOGIC BELOW

}

app.init();

module.exports = app;