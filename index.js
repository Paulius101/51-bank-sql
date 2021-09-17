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
    const create1 = await Bank.create(conn, 'EUR', 'Paulius', 'Dambrauskas', 'LT', 123456710012345678, 10)
    console.log(create1);
    const create2 = await Bank.create(conn, 'EUR', 'Kiaulius', 'Piniginis', 'UK', 123456710012345678, 50)
    console.log(create2);
    const create3 = await Bank.create(conn, 'EUR', 'Riebalius', 'Aptekinis', 'AR', 123456710012345678, 100)
    console.log(create3);
    const create4 = await Bank.create(conn, 'EUR', 'Lysius', 'Skurdzialis', 'CR', 123456710012345678, 1)
    console.log(create4);


}

app.init();

module.exports = app;

// ** Bankas **
// - banke vienintelė valiuta;
// - registruojasi vartotojai;
// - gali susikurti sąskaitas(default, viena sukuriame iš karto registracijos metu);
// - gali įsinešti pinigų;
// - gali išsigryninti;
// - gali persivesti iš sąskaitos į sąskaitą;
// - gali ištrinti savo paskyrą, bet tik jei visose sąskaitose nėra pinigų;

// - banko istorija negali būti trinama:
// --- turi matytis visi atlikti pavedimai, įskaitymai ir išskaitymai kur matyti kas, kada ir kokią operaciją atliko;