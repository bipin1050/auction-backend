const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//signup
module.exports.signup = async function signup(req, res) {
  try {
    let { name, username, password } = req.body;
    //   console.log(dataObj)
    let user = await userModel.create({ name, username, password });
    if (user) {
      return res.status(200).json({
        message: "SignedUp successfully",
        data: user,
      });
    } else {
      res.status(400).json({
        message: "Error while signing",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Login
module.exports.login = async function login(req, res) {
  try {
    let { username, password } = req.body;
    if (username && password) {
      let user = await userModel.findOne({ username });
      if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          let uid = user["_id"];
          let maxAge = 5 * 24 * 60 * 60;
          let token = jwt.sign({ payload: uid }, process.env.SECRET_KEY, {
            expiresIn: maxAge,
          });
          res.cookie("jwt", token, {
            httpOnly: true,
          });
          return res.status(200).json({
            message: "User logged in succesfully",
            jwt: token,
            username: user.username,
            name: user.name,
          });
        } else {
          return res.status(400).json({
            message: "Password doesn't matches",
          });
        }
      } else {
        return res.status(400).json({
          message: "User not found",
        });
      }
    } else {
      return res.status(400).json({
        message: "Empty field found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: {
        err: err.message,
        customMsg: "Something went wrong",
      },
    });
  }
};

module.exports.loginWithToken = async function loginWithToken(req, res) {
  try {
    let { payload } = req.user;
    if (payload) {
      let user = await userModel.findById({ _id: payload });
      if (user) {
        return res.status(200).json({
          message: "User logged in succesfully",
          name : user.name,
          username: user.username,
        });
      } else {
        return res.status(400).json({
          message: "User not found",
        });
      }
    } else {
      return res.status(400).json({
        message: "Empty field found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: {
        err: err.message,
        customMsg: "Something went wrong while verifying token",
      },
    });
  }
};
