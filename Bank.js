const Bank = {};
const Validation = require('./Validation');

Bank.create = async (connection, currency, firstname, lastname, countryCode, defaultAcc, amount) => {
    const sql = 'INSERT INTO klientai (id, firstname, lastname, country_code, default_bank_account_number)\
    VALUES (NULL, "' + firstname + '", "' + lastname + '","' + countryCode + '","' + defaultAcc + '")';
    const [result] = await connection.execute(sql);
    const sql1 = 'SELECT klientai.id\
                    FROM klientai\
                        LEFT JOIN saskaitos\
                        ON klientai.id = saskaitos.user_id';
    const [result1] = await connection.execute(sql1);
    const sql2 = 'INSERT INTO saskaitos (id, user_id, country_code, bank_account_numbers, amount, currency)\
    VALUES (NULL,"'+ sql1 + '", "' + countryCode + '", "' + defaultAcc + '", "' + amount + '","' + currency + '")';
    const [result3] = await connection.execute(sql2);
    return `${firstname} ${lastname} was successfully registered in client list with ${countryCode}${defaultAcc}.`
}

Bank.addAccounts = async (connection, userID, countryCode, bankAcc, amount, currency) => {
    const sql = 'INSERT INTO saskaitos (id, user_id, country_code, bank_account_numbers, amount, currency) \
    VALUES(NULL, "'+ userID + '", "' + countryCode + '", "' + bankAcc + '", "' + amount + '", "' + currency + '")';
    const [result] = await connection.execute(sql);
    return `New account ${countryCode}${bankAcc} of client, by ID = ${userID}, has been successfully registered with ${amount} ${currency}.`
}

Bank.depositMoney = async (connection, accountID, amount) => {
    const sql = 'UPDATE saskaitos SET amount = amount + "' + amount + '" WHERE saskaitos.id =' + accountID;
    const [result] = await connection.execute(sql);
    const sql1 = 'SELECT saskaitos.currency FROM saskaitos WHERE id=1';
    const [result1] = await connection.execute(sql1);
    const sql3 = 'SELECT saskaitos.amount FROM saskaitos WHERE id=' + accountID;
    const [result3] = await connection.execute(sql3);
    return `${amount} ${result1[0].currency} have been added to bank account, by ID = ${accountID}, making a total of ${result3[0].amount} ${result1[0].currency}`

}

Bank.withdrawMoney = async (connection, accountID, amount) => {
    const sql = 'UPDATE saskaitos SET amount = amount - "' + amount + '" WHERE saskaitos.id =' + accountID;
    const [result] = await connection.execute(sql);
    const sql1 = 'SELECT saskaitos.currency FROM saskaitos WHERE id=1';
    const [result1] = await connection.execute(sql1);
    const sql3 = 'SELECT saskaitos.amount FROM saskaitos WHERE id=' + accountID;
    const [result3] = await connection.execute(sql3);
    return `${amount} ${result1[0].currency} have been withdrawn from bank account, by ID = ${accountID}, making a total of ${result3[0].amount} ${result1[0].currency}`

}

Bank.transferMoney = async (connection, sendAccountID, receivAccountID, amount) => {
    const sender = 'UPDATE saskaitos SET amount = amount - "' + amount + '" WHERE saskaitos.id=' + sendAccountID;
    const [result] = await connection.execute(sender);
    const receiver = 'UPDATE saskaitos SET amount = amount + "' + amount + '" WHERE saskaitos.id=' + receivAccountID;
    const [result1] = await connection.execute(receiver);

    const senderAccount = 'SELECT saskaitos.country_code, saskaitos.bank_account_numbers as num FROM saskaitos WHERE saskaitos.id=' + sendAccountID;
    const [info] = await connection.execute(sendAccountID);
    const receiverAccount = 'SELECT saskaitos.country_code, saskaitos.bank_account_numbers as num FROM saskaitos WHERE saskaitos.id=' + receivAccountID;
    const [info1] = await connection.execute(receivAccountID);
    return `${amount} EUR have been sent from ${senderAccount[0].countryCode}${senderAccount[0].num} to ${receiverAccount[0].countryCode}${receiverAccount[0].num}`
}
module.exports = Bank;