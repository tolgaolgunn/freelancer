import Gig from "../models/gigModel.js";
import createError from "../utils/createError.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import grpc from "@grpc/grpc-js";
import soap from "soap";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers  can create a gig!"));

  try {
    let coverUrl = "";
    if (req.body.cover) {
      const coverResult = await cloudinary.uploader.upload(req.body.cover, {
        folder: "gigs",
      });
      coverUrl = coverResult.secure_url;
    }
    const imageUrls = [];
    if (req.body.images && req.body.images.length > 0) {
      for (const image of req.body.images) {
        const imageResult = await cloudinary.uploader.upload(image, {
          folder: "Freelancer",
        });
        imageUrls.push(imageResult.secure_url);
      }
    }

    const newGig = new Gig({
      userId: req.userId,
      ...req.body,
      cover: coverUrl,
      images: imageUrls,
    });

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
  const { userId, cat, min, max, search, sort } = req.query;
  
  const filters = {
    ...(userId && { userId }),
    ...(cat && { cat }),
    ...((min || max) && {
      price: {
        ...(min && { $gt: min }),
        ...(max && { $lt: max }),
      },
    }),
    ...(search && { title: { $regex: search, $options: "i" } }),
  };

  try {
    const gigs = await Gig.find(filters).sort({ [sort]: -1 });
    res.status(200).json(gigs);
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
