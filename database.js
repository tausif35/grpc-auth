const { createConnection } = require("mysql");

const dbConnection = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auth",
});

dbConnection.connect((err) => {
  if (!err) console.log("Connected!");
});

function insertUser(user, callback) {
  dbConnection.query(
    `INSERT INTO tbl_user (name, email, password) VALUES ('${user.name}','${user.email}','${user.password}')`,
    (err, result) => {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        console.log(result);
        callback(null, result);
      }
    }
  );
}

function findUser(loginInfo, callback) {
  dbConnection.query(
    `SELECT * FROM tbl_user WHERE email = '${loginInfo.email}' AND password = '${loginInfo.password}'`,
    (err, result) => {
      if (err || !result.length) {
        console.log(err);
        callback(err, []);
      } else {
        console.log(result);
        callback(null, result);
      }
    }
  );
}

module.exports = {
  insertUser,
  findUser,
};
