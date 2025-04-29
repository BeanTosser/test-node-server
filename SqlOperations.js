const mysql = require('mysql');

var con;

const connectToSql = function(callback){
    con = mysql.createConnection({
        host: "localhost",
        user: "general",
        database: "test_database"
    });
    
    con.connect();
    callback();


}

exports.connectToSql = connectToSql;

exports.getAllPrisoners = function(){
    con.query("SELECT * FROM Prisoners", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        return result;
    });
}

exports.getNamedPrisoner = async function(name, callback){
    connectToSql(() => {
        let queryString = "SELECT * FROM prisoners where name = '" + name + "';"
            con.query(queryString, function (err, result, fields) {
                if(err) throw err;
                callback(result[0]);
            })
        })
}