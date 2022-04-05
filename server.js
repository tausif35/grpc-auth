const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.userPackage;

const { insertUser, findUser } = require("./database.js");

const server = new grpc.Server();

server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());

server.addService(userPackage.User.service, {
  createUser: createUser,
  login: login,
});

server.start();

function createUser(call, callback) {
  const user = {
    name: call.request.name,
    email: call.request.email,
    password: call.request.password,
  };

  insertUser(user, (err, result) => {
    callback(null, {
      statusCode: !err ? 201 : 409,
      message: !err ? "User Creation Successful!" : "User Creation Failed!",
    });
  });
}

function login(call, callback) {
  const loginInfo = {
    email: call.request.email,
    password: call.request.password,
  };

  findUser(loginInfo, (err, result) => {
    callback(null, {
      statusCode: result.length ? 200 : 401,
      message: result.length
        ? "User Login Successful!"
        : "Login failed. Wrong credentials.",
    });
  });
}
