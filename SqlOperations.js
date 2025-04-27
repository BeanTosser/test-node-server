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
    try{
        con.query("SELECT * FROM Prisoners", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            return result;
        });
    } catch(e){
        console.error(e);
    }
}

exports.getNamedPrisoner = async function(name, callback){
    connectToSql(() => {
        let queryString = "SELECT * FROM prisoners where name = '" + name + "';"
        console.log("The query string: " + queryString);
        try{
            con.query(queryString, function (err, result, fields) {
                if(err) throw err;
                console.log("result: " + JSON.stringify(result));
                callback(result);
            })
        } catch(e) {
            console.log("There's a problem.");
            console.error(e);
        }
    })
}