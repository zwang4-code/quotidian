const express = require("express");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");

dotenv.config();
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

app.use(express.json());

const users = [];

function unsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email);
  if (i !== -1) {
    array[i] = item;
  } else {
    array.push(item);
  }
}

app.get("/", (req, res) => {
  res.send("Quotidian server is running!");
});

app.post("/test", (req, res) => {
  console.log(req.body);
  res.send("test");
});

app.post("/api/google-login", async (req, res) => {
  console.log("Received request:", req.body);
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const { name, email, picture } = ticket.getPayload();
  upsert(users, { name, email, picture });
  res.status(201);
  res.json({ name, email, picture });
});

app.listen(process.env.PORT || 5001, () => {
  console.log(
    `Server running on  http://localhost:${process.env.PORT || 5001}`
  );
});
