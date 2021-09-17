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
    const create1 = await Bank.create(conn, 'EUR', 'Paulius', 'Dambrauskas', 'LT', 123456710012345680, 10)
    console.log(create1);
    const create2 = await Bank.create(conn, 'EUR', 'Kiaulius', 'Piniginis', 'UK', 123456710012345680, 50)
    console.log(create2);
    const create3 = await Bank.create(conn, 'EUR', 'Riebalius', 'Aptekinis', 'AR', 123456710012345680, 100)
    console.log(create3);
    const create4 = await Bank.create(conn, 'EUR', 'Lysius', 'Skurdzialis', 'CR', 123456710012345680, 1)
    console.log(create4);

    const addAccounts1 = await Bank.addAccounts(conn, 1, 'UK', 526456811012695271, 15, 'EUR')
    console.log(addAccounts1);
    const addAccounts2 = await Bank.addAccounts(conn, 2, 'LT', 845656811012695841, 100, 'EUR')
    console.log(addAccounts2);
    const addAccounts3 = await Bank.addAccounts(conn, 3, 'CR', 711175312012695753, 150, 'EUR')
    console.log(addAccounts3);
    const addAccounts4 = await Bank.addAccounts(conn, 4, 'AR', 485456832562695951, 5, 'EUR')
    console.log(addAccounts4);

    const deposit1 = await Bank.depositMoney(conn, 1, 12)
    console.log(deposit1);
    const deposit2 = await Bank.depositMoney(conn, 2, 40)
    console.log(deposit2);
    const deposit3 = await Bank.depositMoney(conn, 3, 50)
    console.log(deposit3);
    const deposit4 = await Bank.depositMoney(conn, 4, 7)
    console.log(deposit4);

    const withdraw1 = await Bank.withdrawMoney(conn, 1, 5)
    console.log(withdraw1);
    const withdraw2 = await Bank.withdrawMoney(conn, 2, 4)
    console.log(withdraw2);

    const transfer1 = await Bank.transferMoney(conn, 3, 1, 50)
    console.log(transfer1);
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