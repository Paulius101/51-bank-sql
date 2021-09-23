const db = require('./db');
const Bank = require('./Methodology/Bank');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const conn = await db.init({
        host: 'localhost',
        user: 'root',
        database: 'bank',
    });

    // LOGIC BELOW
    const currency1 = await Bank.addCurrency(conn, 'EUR', 1.17);
    console.log(currency1);
    const currency2 = await Bank.addCurrency(conn, 'USD', 0.85);
    console.log(currency2);

    const create1 = await Bank.create(conn, 'EUR', 'Paulius', 'Dambrauskas', 'LT')
    console.log(create1);
    const create2 = await Bank.create(conn, 'EUR', 'Kiaulius', 'Piniginis', 'UK')
    console.log(create2);
    const create3 = await Bank.create(conn, 'EUR', 'Riebalius', 'Aptekinis', 'AR')
    console.log(create3);
    const create4 = await Bank.create(conn, 'EUR', 'Lysius', 'Skurdzialis', 'CR')
    console.log(create4);

    const addAccounts1 = await Bank.addAccount(conn, 1, 'EUR')
    console.log(addAccounts1);
    const addAccounts2 = await Bank.addAccount(conn, 2, 'EUR')
    console.log(addAccounts2);
    const addAccounts3 = await Bank.addAccount(conn, 3, 'EUR')
    console.log(addAccounts3);
    const addAccounts4 = await Bank.addAccount(conn, 4, 'EUR')
    console.log(addAccounts4);

    const deposit1 = await Bank.depositMoney(conn, 1, 12, 'USD')
    console.log(deposit1);
    const deposit2 = await Bank.depositMoney(conn, 2, 40, 'EUR')
    console.log(deposit2);
    const deposit3 = await Bank.depositMoney(conn, 3, 50, 'USD')
    console.log(deposit3);
    const deposit4 = await Bank.depositMoney(conn, 4, 7, 'USD')
    console.log(deposit4);
    const deposit5 = await Bank.depositMoney(conn, 5, 15, 'USD')
    console.log(deposit5);
    const deposit6 = await Bank.depositMoney(conn, 6, 30, 'USD')
    console.log(deposit6);
    const deposit7 = await Bank.depositMoney(conn, 7, 25, 'USD')
    console.log(deposit7);
    const deposit8 = await Bank.depositMoney(conn, 8, 14, 'USD')
    console.log(deposit8);

    const withdraw1 = await Bank.withdrawMoney(conn, 1, 5, 'USD')
    console.log(withdraw1);
    const withdraw2 = await Bank.withdrawMoney(conn, 2, 46.8, 'USD')
    console.log(withdraw2);
    const withdraw3 = await Bank.withdrawMoney(conn, 6, 30, 'USD')
    console.log(withdraw3);

    const transfer1 = await Bank.transferMoney(conn, 2, 1, 0.22)
    console.log(transfer1);



    const deleteAccount = await Bank.deleteUser(conn, 2)
    console.log(deleteAccount);
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
// sukurimas ir deaktyvavimas saskaitu