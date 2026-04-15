const connectDB = require("./database.js");

async function main() {
  const db = await connectDB();
  const users = await db.collection("alarms").find().toArray();
  const users2 = Object.values(users[0]);
  users2.pop();
  console.log(users2);
}

main();