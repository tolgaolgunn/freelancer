import Gig from "../models/gigModel.js";
import createError from "../utils/createError.js";
import grpc from "@grpc/grpc-js";
import soap from "soap";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getGigExpress = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};


export const getGigGrpc = async (call, callback) => {
  try {
    const { gigId } = call.request;
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Gig not found!",
      });
    }
    callback(null, gig);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};
export const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};

export const getGigSoap = async (args, callback) => {
  try {
    const { gigId } = args;
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return callback({
        code: 404,
        message: "Gig not found!",
      });
    }
    callback(null, { gig: JSON.stringify(gig) });
  } catch (err) {
    callback({
      code: 500,
      message: err.message,
    });
  }
};

const gigService = {
  GigService: {
    GigServicePortType: {
      getGig: getGigSoap,
    },
  },
};

const gigWsdlPath = './wsdl/gigService.wsdl';


export const startGigSoapServer = (app) => {
  soap.listen(app, '/gigs/wsdl', gigService, gigWsdlPath, () => {
    console.log(`Gig SOAP server running at http://localhost:8800/gigs/wsdl`);
  });
};
