const Transactions = {};
const Validation = require('../validations/Validation');

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} accountID Banko saskaitos ID.
 * @param {number} amount Pinigu kiekis.
 */
Transactions.deposit = async (connection, accountID, amount, currency) => {
    const insert = 'INSERT INTO `log_deposit_withdraw` (id, account_id, amount, currency, type)\
VALUES (NULL, "'+ accountID + '", "' + amount + '","' + currency + '", "DEPOSIT")';
    await connection.execute(insert);
}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} accountID Banko saskaitos ID.
 * @param {number} amount Pinigu kiekis.
 */
Transactions.withdraw = async (connection, accountID, amount, currency) => {
    const insert = 'INSERT INTO `log_deposit_withdraw` (id, account_id, amount,currency, type)\
VALUES (NULL, "'+ accountID + '", "' + amount + '","' + currency + '", "WITHDRAW")';
    await connection.execute(insert);
}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} senderID Siuntejo banko saskaitos ID.
 * @param {number} receiverID Gavejo banko saskaitos ID.
 * @param {number} amount Pinigu kiekis.
 */
Transactions.transfer = async (connection, senderID, receiverID, amount, currency) => {
    const insert = 'INSERT INTO log_transactions (id, sender_account_id, receiver_account_id, amount, currency)\
VALUES (NULL, "'+ senderID + '","' + receiverID + '", "' + amount + '","' + currency + '")';
    await connection.execute(insert);
}
module.exports = Transactions;


