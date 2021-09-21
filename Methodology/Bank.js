const Bank = {};
const Validation = require('../validations/Validation');
const Transactions = require('./Transactions');

/**
 * 
 * @param {number} length Atsitiktinio skaiciaus ilgis, default = 14.
 * @returns {<string>} Grazina atsitiktine tvarka sugeneruota 14 skaitmenu teksta.
 */
Bank.createRandomNumber = (length = 14) => {
    //Generuojame atsitiktini 14 skaitmenu string.
    const possibleCharacters = '0123456789';
    const possibleCharactersCount = possibleCharacters.length;
    let str = '';
    for (let i = 0; i < length; i++) {
        str += possibleCharacters[Math.floor(Math.random() * possibleCharactersCount)];
    }
    return str
}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {string} currency Valiuta.
 * @param {string} firstname Vardas.
 * @param {string} lastname Pavarde.
 * @param {string} countryCode Miesto kodas (trumpas teksas)
 * @returns {Promise<string>} Tekstas parodantis, koks accountas buvo uzregistruotas.
 */
Bank.create = async (connection, currency, firstname, lastname, countryCode) => {
    if (!Validation.isValidName(firstname)) {
        return `ERROR: not a valid name`
    }

    if (!Validation.isValidName(lastname)) {
        return `ERROR: not a valid lastname`
    }

    if (!Validation.isText(currency)) {
        return `ERROR: not a valid currency`
    }

    const availableCurrencies = ['EUR', 'USD'];
    if (!availableCurrencies.includes(currency)) {
        return 'ERROR: neleistina valiuta'
    }

    if (!Validation.isText(countryCode)) {
        return `ERROR: not a valid country code`

    }

    //Iterpiame kliento informacija i klientai lentele.
    const insertKlientai = 'INSERT INTO klientai (id, firstname, lastname, country_code)\
    VALUES (NULL, "' + firstname + '", "' + lastname + '","' + countryCode + '")';
    const [result] = await connection.execute(insertKlientai);
    // console.log(result);
    if (result.affectedRows !== 1) {
        return 'ERROR: saskaita nebuvo sekmingai iregistruota'
    }

    //Iterpiame kliento pirmosios saskaitos informacija i saskaitos lentele.
    let generatedAccount = countryCode + Bank.createRandomNumber();
    const insertSaskaitos = 'INSERT INTO saskaitos (id, user_id, bank_account_numbers, amount, currency)\
    VALUES (NULL,"'+ result.insertId + '", "' + generatedAccount + '", 0 ,"' + currency + '")';
    const [result3] = await connection.execute(insertSaskaitos);
    if (result3.affectedRows !== 1) {
        return 'ERROR: saskaita nebuvo sekmingai iregistruota'
    }

    return `${firstname} ${lastname} was successfully registered in client list with ${countryCode}${generatedAccount}.`
}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {string} userID Vartotojo ID.
 * @param {string} currency Valiuta.
 * @returns {<string>} Grazina informacija apie prideta paskyra.
 */
Bank.addAccount = async (connection, userID, currency) => {
    if (!Validation.IDisValid(userID)) {
        return `ERROR: user ID is not valid`
    }
    if (!Validation.isText(currency)) {
        return `ERROR: not a valid currency`
    }
    const availableCurrencies = ['EUR', 'USD'];
    if (!availableCurrencies.includes(currency)) {
        return 'ERROR: currency type not allowed'
    }

    //Susirandame ir susiejame vartotojo (pagal ID) salies koda su atsitiktinai sukurtu saskaitos numeriu.
    const countryCode = 'SELECT country_code FROM klientai WHERE id=' + userID;
    const [result1] = await connection.execute(countryCode)
    let generatedAccount = result1[0].country_code + Bank.createRandomNumber();

    //Iterpiame saskaita i saskaitos lentele.
    const insertSaskaitos = 'INSERT INTO saskaitos (id, user_id, bank_account_numbers, amount, currency)\
    VALUES (NULL,"'+ userID + '", "' + generatedAccount + '", 0 ,"' + currency + '")';
    const [result] = await connection.execute(insertSaskaitos);

    if (result.affectedRows !== 1) {
        return 'ERROR: account failed to register'
    }

    return `New account ${generatedAccount} of client, by ID = ${userID}, has been successfully registered with 0 ${currency}.`
}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} accountID Paskyros ID.
 * @param {number} amount Pinigu kiekis.
 * @returns {<string>} Pateikia informacija apie prie paskyros pridetu pinigu kieki.
 */
Bank.depositMoney = async (connection, accountID, amount) => {
    if (!Validation.IDisValid(accountID)) {
        return `ERROR: account ID is not valid`
    }

    if (!Validation.isValidAmount(amount)) {
        return 'ERROR: wrong amount format.'
    }

    //Patikriname ar saskaita yra aktyvi.
    const isActive = 'SELECT saskaitos.active FROM saskaitos WHERE id=' + accountID;
    const [check] = await connection.execute(isActive);
    if (check.active === 'FALSE') {
        return `ERROR: account by ID = ${accountID} is not active!`
    }

    //Atnaujiname saskaitos likuti.
    const deposit = 'UPDATE saskaitos SET amount = amount + "' + amount.toFixed(2) + '" WHERE saskaitos.id =' + accountID;
    const [result] = await connection.execute(deposit);
    const currency = 'SELECT saskaitos.currency FROM saskaitos WHERE id=' + accountID;
    const [result1] = await connection.execute(currency);

    //Irasome sia operacija i tam skirta lentele.
    Transactions.deposit(connection, accountID, amount);

    //Issitraukiame informacija reikalinga return stringui.
    const balance = 'SELECT saskaitos.amount FROM saskaitos WHERE id=' + accountID;
    const [result3] = await connection.execute(balance);

    return `${amount} ${result1[0].currency} have been added to bank account, by ID = ${accountID}, making a total of ${result3[0].amount} ${result1[0].currency}`

}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} accountID Paskyros ID.
 * @param {number} amount Pinigu kiekis.
 * @returns {<string>} Pateikia informacija apie is paskyros isimtu pinigu kieki.
 */
Bank.withdrawMoney = async (connection, accountID, amount) => {
    if (!Validation.IDisValid(accountID)) {
        return `ERROR: account ID is not valid`
    }

    if (!Validation.isValidAmount(amount)) {
        return 'ERROR: wrong amount format.'
    }

    //Patikriname ar saskaita yra aktyvi.
    const isActive = 'SELECT saskaitos.active FROM saskaitos WHERE id=' + accountID;
    const [check] = await connection.execute(isActive);
    if (check.active === 'FALSE') {
        return `ERROR: account by ID = ${accountID} is not active!`
    }

    //Patikriname ar pakanka pinigu nuemimui.
    const currentBalance = 'SELECT saskaitos.amount FROM saskaitos WHERE id=' + accountID;
    const [result] = await connection.execute(currentBalance)
    if (result[0].amount < amount) {
        return 'ERROR: insuficient funds.'
    }

    //Atnaujiname saskaitos likuti.
    const withdraw = 'UPDATE saskaitos SET amount = amount - "' + amount.toFixed(2) + '" WHERE saskaitos.id =' + accountID;
    const [result1] = await connection.execute(withdraw);


    //Irasome sia operacija i tam skirta lentele.
    Transactions.withdraw(connection, accountID, amount)

    //Issitraukiame informacija reikalinga return stringui.
    const currency = 'SELECT saskaitos.currency FROM saskaitos WHERE id=1';
    const [result2] = await connection.execute(currency);
    const balance = 'SELECT saskaitos.amount FROM saskaitos WHERE id=' + accountID;
    const [result3] = await connection.execute(balance);

    return `${amount} ${result2[0].currency} have been withdrawn from bank account, by ID = ${accountID}, making a total of ${result3[0].amount} ${result2[0].currency}`

}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} sendAccountID Siuntejo paskyros ID.
 * @param {number} receivAccountID Gavejo paskyros ID.
 * @param {number} amount Pinigu kiekis.
 * @returns {<string>} Grazina teksta rodanti kokia suma pinigu buvo pervesta is vienos saskaitos i kita.
 */
Bank.transferMoney = async (connection, sendAccountID, receivAccountID, amount) => {
    if (!Validation.IDisValid(sendAccountID)) {
        return `ERROR: account ID is not valid`
    }
    if (!Validation.IDisValid(receivAccountID)) {
        return `ERROR: account ID is not valid`
    }
    if (!Validation.isValidAmount(amount)) {
        return 'ERROR: wrong amount format.'
    }

    //Patikriname ar siuntejo saskaita yra aktyvi.
    const isActive1 = 'SELECT saskaitos.active FROM saskaitos WHERE id=' + sendAccountID;
    const [check1] = await connection.execute(isActive1);
    if (check1.active === 'FALSE') {
        return `ERROR: account by ID = ${sendAccountID} is not active!`
    }

    //Patikriname ar gavejo saskaita yra aktyvi.
    const isActive2 = 'SELECT saskaitos.active FROM saskaitos WHERE id=' + receivAccountID;
    const [check2] = await connection.execute(isActive2);
    if (check2.active === 'FALSE') {
        return `ERROR: account by ID = ${receivAccountID} is not active!`
    }

    //Patikriname ar saskaitoje yra ne maziau pinigu nei reikia pervedimui.
    const currentBalance = 'SELECT saskaitos.amount FROM saskaitos WHERE id=' + sendAccountID;
    const [resultas] = await connection.execute(currentBalance)
    if (resultas[0].amount < amount) {
        return 'ERROR: insuficient funds.'
    }


    //Atnaujiname tiek gavejo tiek siuntejo saskaitu likucius.
    const sender = 'UPDATE saskaitos SET amount = amount - "' + amount.toFixed(2) + '" WHERE saskaitos.id=' + sendAccountID;
    const [result] = await connection.execute(sender);
    const receiver = 'UPDATE saskaitos SET amount = amount + "' + amount.toFixed(2) + '" WHERE saskaitos.id=' + receivAccountID;
    const [result1] = await connection.execute(receiver);

    //Irasome si pervedima i tam skirta lentele.
    Transactions.transfer(connection, sendAccountID, receivAccountID, amount)


    //Issitraukiame reikalinga informacija return stringui.
    const senderAccount = 'SELECT saskaitos.bank_account_numbers as num1 FROM saskaitos WHERE saskaitos.id=' + sendAccountID;
    const [info] = await connection.execute(senderAccount);
    const receiverAccount = 'SELECT saskaitos.bank_account_numbers as num2 FROM saskaitos WHERE saskaitos.id=' + receivAccountID;
    const [info1] = await connection.execute(receiverAccount);

    return `${amount} EUR have been sent from ${info[0].num1} to ${info1[0].num2}`
}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} usersID Vartotojo ID.
 * @returns {<string>} Pasako kokio vartotojo paskyra buvo istrinta.
 */
Bank.deleteUser = async (connection, usersID) => {
    if (!Validation.IDisValid(usersID)) {
        return `ERROR: user ID is not valid`
    }

    //Tikriname ar tam tikram userID priklausancios saskaitos turi pinigu.
    const currentBalance = 'SELECT saskaitos.amount FROM saskaitos WHERE user_id=' + usersID;
    const [resultas] = await connection.execute(currentBalance);

    let totalBalance = 0;
    for (const balance of resultas) {
        totalBalance += Number.parseFloat(balance.amount)
    }

    if (totalBalance > 0) {
        return `ERROR: funds found in at least one of the accounts that belong to user ID = ${usersID}.`
    }

    //Issitraukiame varda/ pavarde return stringui.
    const name = 'SELECT firstname, lastname FROM klientai WHERE klientai.id =' + usersID;
    const [result2] = await connection.execute(name)

    //Pakeiciame saskaitos aktyvuma i FALSE.
    const deleteAccSaskaitos = 'UPDATE saskaitos SET active = "FALSE" WHERE saskaitos.user_id =' + usersID;
    const [result1] = await connection.execute(deleteAccSaskaitos)

    if (resultas.length !== result1.affectedRows) {
        return 'ERROR: at least one bank account still exists, hence can not delete the user account.'
    }

    //Pakeiciame paskyros aktyvuma i FALSE.
    const deleteAccKlientai = 'UPDATE klientai SET active = "FALSE" WHERE klientai.id =' + usersID;
    const [result] = await connection.execute(deleteAccKlientai);





    return `Users, by ID = ${usersID} and name ${result2[0].firstname} ${result2[0].lastname}, account has been deleted.`
}
module.exports = Bank;