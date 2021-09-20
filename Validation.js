class Validation {

    static isValidName(name) {
        const abc = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
        for (const n of name) {
            if (!abc.includes(n)) {
                return false
            }
            return true
        }
        if (name === undefined ||
            typeof name !== 'string' ||
            name.length < 2 ||
            !Validation.isUpperCase(name[0])) {
            return false;
        }
        return true;
    }


    static isUpperCase(letter) {
        return letter === letter.toUpperCase();
    }


    static IDisValid = (id) => {

        if (typeof id !== 'number' ||
            !isFinite(id) ||
            id < 1 ||
            id % 1 !== 0) {
            return false
        }
        return true
    }

    static isValidAmount = (amount) => {
        if (typeof amount !== 'number' ||
            amount < 0 ||
            !isFinite(amount)) {
            return false
        }
        return true

    }

    static isText = (text) => {
        const abc = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
        for (const t of text) {
            if (!abc.includes(t)) {
                return false
            }
            return true
        }

        if (text === undefined ||
            typeof text !== 'string' ||
            text.length < 2 ||
            text === '') {
            return false;
        }
        return true;
    }
}
module.exports = Validation;