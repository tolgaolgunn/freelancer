import User from "../models/userModel.js";
import createError from "../utils/createError.js";
import grpc from "@grpc/grpc-js";

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted.");
};
export const getUserExpress = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};

export const getUserGrpc = async (call, callback) => {
  try {
    const { userId } = call.request;
    const user = await User.findById(userId);
    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "User not found!",
      });
    }
    callback(null, user);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};