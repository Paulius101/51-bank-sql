const Transactions = {};
const Validation = require('../validations/Validation');

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} accountID Banko saskaitos ID.
 * @param {number} amount Pinigu kiekis.
 */
Transactions.deposit = async (connection, accountID, amount) => {
    const insert = 'INSERT INTO `deposit/withdraw` (id, account_id, amount, type)\
VALUES (NULL, "'+ accountID + '", "' + amount + '", "DEPOSIT")';
    const [result] = await connection.execute(insert);
}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} accountID Banko saskaitos ID.
 * @param {number} amount Pinigu kiekis.
 */
Transactions.withdraw = async (connection, accountID, amount) => {
    const insert = 'INSERT INTO `deposit/withdraw` (id, account_id, amount, type)\
VALUES (NULL, "'+ accountID + '", "' + amount + '", "WITHDRAW")';
    const [result] = await connection.execute(insert);
}

/**
 * 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} senderID Siuntejo banko saskaitos ID.
 * @param {number} receiverID Gavejo banko saskaitos ID.
 * @param {number} amount Pinigu kiekis.
 */
Transactions.transfer = async (connection, senderID, receiverID, amount) => {
    const insert = 'INSERT INTO transactions (id, sender_account_id, receiver_account_id, amount)\
VALUES (NULL, "'+ senderID + '","' + receiverID + '", "' + amount + '")';
    const [result] = await connection.execute(insert);
}
module.exports = Transactions;


