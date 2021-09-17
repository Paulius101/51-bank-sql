const Bank = {};
const Validation = require('./Validation');

Bank.create = async (connection, currency, firstname, lastname, countryCode, defaultAcc, amount) => {
    const sql = 'INSERT INTO klientai (id, firstname, lastname, country_code, default_bank_account_number, amount, currency)\
    VALUES (NULL, "' + firstname + '", "' + lastname + '","' + countryCode + '","' + defaultAcc + '","' + amount + '","' + currency + '")';
    const [rows] = await connection.execute(sql);
    return `${firstname} ${lastname} buvo sekmingai uzregistruotas su ${countryCode}${defaultAcc}.`
}



module.exports = Bank;