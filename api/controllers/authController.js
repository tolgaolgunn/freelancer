import User from "../models/userModel.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import grpc from '@grpc/grpc-js';
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};




export const loginExpress = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const loginGrpc = async (call, callback) => {
  try {
    const { username, password } = call.request;
    const user = await User.findOne({ username });

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "User not found!",
      });
    }

    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Wrong password or username!",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password: userPassword, ...info } = user._doc;
    callback(null, { token, user: info });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
