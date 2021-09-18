const Bank = {};
const Validation = require('./Validation');
/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {string} currency Valiuta.
 * @param {string} firstname Vardas.
 * @param {string} lastname Pavarde.
 * @param {string} countryCode Miesto kodas (trumpas teksas)
 * @param {number} defaultAcc Banko saskaitos skaitine dalis.
 * @param {number} amount Pinigu kiekis (skaicius)
 * @returns {Promise<string>} Tekstas parodantis, kurie accountai buvo uzregistruoti.
 */
Bank.createRandomNumber = (length = 14) => {
    const possibleCharacters = '0123456789';
    const possibleCharactersCount = possibleCharacters.length;
    let str = '';
    for (let i = 0; i < length; i++) {
        str += possibleCharacters[Math.floor(Math.random() * possibleCharactersCount)];
    }
    return str
}

Bank.create = async (connection, currency, firstname, lastname, countryCode) => {
    const insertKlientai = 'INSERT INTO klientai (id, firstname, lastname, country_code)\
    VALUES (NULL, "' + firstname + '", "' + lastname + '","' + countryCode + '")';
    const [result] = await connection.execute(insertKlientai);
    // console.log(result);

    let generatedAccount = countryCode + Bank.createRandomNumber();
    const insertSaskaitos = 'INSERT INTO saskaitos (id, user_id, bank_account_numbers, amount, currency)\
    VALUES (NULL,"'+ result.insertId + '", "' + generatedAccount + '", 0 ,"' + currency + '")';
    const [result3] = await connection.execute(insertSaskaitos);

    return `${firstname} ${lastname} was successfully registered in client list with ${countryCode}${generatedAccount}.`
}

Bank.addAccount = async (connection, userID, currency) => {
    //patikrinti ar affected rows ===1
    const countryCode = 'SELECT country_code FROM klientai WHERE id=' + userID;
    const [result1] = await connection.execute(countryCode)
    // console.log(result1[0].country_code);
    let generatedAccount = result1[0].country_code + Bank.createRandomNumber();
    // console.log(generatedAccount);
    const insertSaskaitos = 'INSERT INTO saskaitos (id, user_id, bank_account_numbers, amount, currency)\
    VALUES (NULL,"'+ userID + '", "' + generatedAccount + '", 0 ,"' + currency + '")';
    const [result] = await connection.execute(insertSaskaitos);
    return `New account ${generatedAccount} of client, by ID = ${userID}, has been successfully registered with 0 ${currency}.`
}

Bank.depositMoney = async (connection, accountID, amount) => {
    const deposit = 'UPDATE saskaitos SET amount = amount + "' + amount + '" WHERE saskaitos.id =' + accountID;
    const [result] = await connection.execute(deposit);
    const currency = 'SELECT saskaitos.currency FROM saskaitos WHERE id=1';
    const [result1] = await connection.execute(currency);
    const balance = 'SELECT saskaitos.amount FROM saskaitos WHERE id=' + accountID;
    const [result3] = await connection.execute(balance);
    return `${amount} ${result1[0].currency} have been added to bank account, by ID = ${accountID}, making a total of ${result3[0].amount} ${result1[0].currency}`

}

Bank.withdrawMoney = async (connection, accountID, amount) => {
    const withdraw = 'UPDATE saskaitos SET amount = amount - "' + amount + '" WHERE saskaitos.id =' + accountID;
    const [result] = await connection.execute(withdraw);
    const currency = 'SELECT saskaitos.currency FROM saskaitos WHERE id=1';
    const [result1] = await connection.execute(currency);
    const balance = 'SELECT saskaitos.amount FROM saskaitos WHERE id=' + accountID;
    const [result3] = await connection.execute(balance);
    return `${amount} ${result1[0].currency} have been withdrawn from bank account, by ID = ${accountID}, making a total of ${result3[0].amount} ${result1[0].currency}`

}

Bank.transferMoney = async (connection, sendAccountID, receivAccountID, amount) => {
    const sender = 'UPDATE saskaitos SET amount = amount - "' + amount + '" WHERE saskaitos.id=' + sendAccountID;
    const [result] = await connection.execute(sender);
    const receiver = 'UPDATE saskaitos SET amount = amount + "' + amount + '" WHERE saskaitos.id=' + receivAccountID;
    const [result1] = await connection.execute(receiver);

    const senderAccount = 'SELECT saskaitos.bank_account_numbers as num1 FROM saskaitos WHERE saskaitos.id=' + sendAccountID;
    const [info] = await connection.execute(senderAccount);
    const receiverAccount = 'SELECT saskaitos.bank_account_numbers as num2 FROM saskaitos WHERE saskaitos.id=' + receivAccountID;
    const [info1] = await connection.execute(receiverAccount);
    return `${amount} EUR have been sent from ${info[0].num1} to ${info1[0].num2}`
}

Bank.deleteAccount = async (connection, usersID) => {
    const name = 'SELECT firstname, lastname FROM klientai WHERE klientai.id =' + usersID;
    const [result2] = await connection.execute(name)

    const deleteAccKlientai = 'DELETE FROM klientai WHERE klientai.id =' + usersID;
    const [result] = await connection.execute(deleteAccKlientai);

    const deleteAccSaskaitos = 'DELETE FROM saskaitos WHERE saskaitos.user_id =' + usersID;
    const [result1] = await connection.execute(deleteAccSaskaitos)



    return `Users, by ID = ${usersID} and name ${result2[0].firstname} ${result2[0].lastname}, account has been deleted.`
}
module.exports = Bank;