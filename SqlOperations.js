const mysql = require('mysql2/promise');
const utilities = require('./utilities/utilities');
const bcrypt = require('bcrypt');

const connectToSql = async function(){
    return await mysql.createConnection({
        host: "localhost",
        user: "general",
        database: "test_database"
    });


}

const connectToSqlAuth = async function() {
    return await mysql.createConnection({
        host: "localhost",
        user: "identity_manager",
        password: "identity_manager_password", //Including the password in code should not present a security issue as login must occur from localhost anyway
        database: "users"
    })
}

exports.login = async function(username, password){
    const connection = await connectToSqlAuth();
    const queryString = 'SELECT `passwordHash`, `salt` FROM `login` WHERE `username` = ?;';
    const [results, fields] = await connection.execute(queryString, [username]);
    const enteredPassHash = await utilities.hashFromString(password, results[0].salt);
    if(results.length > 0){
        console.log("results.length is long enough...")
        if(enteredPassHash === results[0].passwordHash){
            return true;
        }
    }
    console.log("Returning false.");
    // Either user doesn't exist or the password is incorrect
    return false;
}


exports.addUser = async function(username, password){
    console.log("Running addUser in SqlOperations");
    const connection = await connectToSqlAuth();
    const salt = await bcrypt.genSalt(utilities.saltRounds);
    const passwordHash = await utilities.hashFromString(password, salt);
    const queryString = "INSERT INTO `login` (`username`, `passwordHash`, `salt`) VALUES(?, ?, ?);";
    try{
        const [rows, fields] = await connection.execute(queryString, [username, passwordHash, salt]);
    } catch(e){
        console.log("failed to add user to database due to: " + e);
        throw(e);
    }
    return true;
}

exports.connectToSql = connectToSql;
exports.connectToSqlAuth = connectToSqlAuth;

/*
exports.getAllPrisoners = function(){
    con.execute("SELECT * FROM Prisoners", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        return result;
    });
}
*/

exports.getNamedPrisoner = async function(name, callback){
    const con = await connectToSql();
    let queryString = "SELECT * FROM `prisoners` where `name` = ?;";
    const [rows, fields] = await con.execute(queryString, [name]);
    callback(rows[0]);
}