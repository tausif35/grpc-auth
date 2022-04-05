const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.userPackage;
const prompt = require("prompt-sync")({ sigint: true });

const client = new userPackage.User(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

console.log("GRPC User Authentication");
const trigger = prompt("Press 1 to create user, 2 to login: ");
console.log(trigger);
if (trigger == 1) {
  createNewUser();
} else if (trigger == 2) {
  login();
}

async function createNewUser() {
  let newName = prompt("Enter New User Name: ");
  let newEmail = prompt("Enter New User Email: ");
  let password = prompt("Enter password: ");

  await client.createUser(
    {
      name: newName,
      email: newEmail,
      password: password,
    },
    (err, response) => {
      console.log("Received from server " + JSON.stringify(response));
    }
  );
}

async function login() {
  let email = prompt("Enter User Email: ");
  let password = prompt("Enter password: ");
  await client.login(
    {
      email: email,
      password: password,
    },
    (err, response) => {
      console.log("Received from server " + JSON.stringify(response));
    }
  );
}
