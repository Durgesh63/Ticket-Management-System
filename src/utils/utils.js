const checkVaoidEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const bcrypt = require('bcrypt');
const isValidPassowrd = async (password, dbPassword) => {
    return await bcrypt.compare(password, dbPassword)
}
function validatePassword(password) {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

module.exports = { checkVaoidEmail, isValidPassowrd, validatePassword };