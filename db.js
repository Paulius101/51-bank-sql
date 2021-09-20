const mysql = require('mysql2/promise');

const db = {}

db.init = async ({ database, host, user }) => {
    const connection = await db.createDatabase({ database, host, user });

    await db.createBankClientTable(connection);
    await db.createBankAccountsTable(connection);

    return connection;
}

db.createDatabase = async ({ database, host, user }) => {
    host = host ? host : 'localhost';
    user = user ? user : 'root';

    try {
        let db = await mysql.createConnection({ host, user });
        await db.execute(`DROP DATABASE IF EXISTS \`${database}\``);
        console.log('Buvusi duombaze istrinta');
    } catch (error) {
        console.log('Nera duombazes, kuria butu galima istrinti');
    }

    try {
        let db = await mysql.createConnection({ host, user });
        await db.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        await db.end();

        db = await mysql.createConnection({ host, user, database });
        console.log('Nauja duombaze sukurta');
        return db;
    } catch (error) {
        return error;
    }
}

db.createBankClientTable = async (connection) => {
    try {
        const sql = 'CREATE TABLE IF NOT EXISTS `Klientai` (\
                        `id` int(10) NOT NULL AUTO_INCREMENT,\
                        `firstname` char(20) COLLATE utf8_swedish_ci NOT NULL,\
                        `lastname` char(20) COLLATE utf8_swedish_ci NOT NULL,\
                        `country_code` char(5) COLLATE utf8_swedish_ci NOT NULL,\
                        PRIMARY KEY(`id`)\
                    ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_swedish_ci';
        await connection.execute(sql);
    } catch (error) {
        console.log('Nepavyko sukurti banko klientu lenteles');
        console.log(error);
        return error;
    }
}
db.createBankAccountsTable = async (connection) => {
    try {
        const sql = 'CREATE TABLE IF NOT EXISTS `Saskaitos` (\
                        `id` int(10) NOT NULL AUTO_INCREMENT,\
                        `user_id` int(10) NOT NULL,\
                        `bank_account_numbers` char(16) NOT NULL,\
                        `amount` decimal(10,2) NOT NULL,\
                        `currency` char(10) COLLATE utf8_swedish_ci NOT NULL,\
                        PRIMARY KEY(`id`)\
                    ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_swedish_ci';
        await connection.execute(sql);
        // const foreignKey = 'ALTER TABLE `saskaitos` ADD FOREIGN KEY(`user_id`) REFERENCES`klientai`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT';
        // await connection.execute(foreignKey)
    } catch (error) {
        console.log('Nepavyko sukurti banko klientu saskaitu lenteles');
        console.log(error);
        return error;
    }
}

module.exports = db;

// ALTER TABLE `saskaitos` ADD FOREIGN KEY (`user_id`) REFERENCES `klientai`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;\