import User from "../../models/user.js";

async function findUser(data) {
  return await User.findOne({ email: data.email });
}

export async function register(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const data = {
      email,
      password,
    };
    const check = await findUser(data);
    console.log(email);
    console.log(password);

    //if user already exists
    if (check) {
      console.log(check);
      res.status(409).send(`User already exists. Try loggin in.`);
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(`Error while hashing the password ${err}`);
        } else {
          const user = {
            email: email,
            password: hash,
          };
          await registerUser(user);
          res.status(200).send("registered");
        }
      });
    }
  } catch (err) {
    console.error(`Error while registering the user: ${err}`);
    res.status(500).send(`Internal server error`);
  }
}
