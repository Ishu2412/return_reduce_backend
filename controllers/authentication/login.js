import bcrypt from "bcrypt";

import User from "../../models/user.js";

async function findUser(data) {
  return await User.findOne({ email: data.email });
}

export async function login(req, res) {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await findUser(data);
    if (user) {
      const storedHashedPassword = user.password;
      bcrypt.compare(data.password, storedHashedPassword, (err, result) => {
        if (err) {
          res.status(500).send(`Error while Authorizing`);
        } else {
          if (result) {
            res.status(200).send("logined");
          } else {
            res.status(401).send(`Password not match`);
          }
        }
      });
    } else {
      res.status(401).send(`User not found`);
    }
  } catch {
    res.status(500).send(`Internal Server Error`);
  }
}
