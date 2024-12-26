import createError from "../utils/createError.js";
import Review from "../models/reviewModel.js";
import Gig from "../models/gigModel.js";
import grpc from '@grpc/grpc-js';
import soap from "soap";

export const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Sellers can't create a review!"));

  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });

    if (review)
      return next(
        createError(403, "You have already created a review for this gig!")
      );


    const savedReview = await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },//inc: increment
    });
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};


export const getReviewExpress = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};

export const getReviewGrpc = async (call, callback) => {
  try {
    const { reviewId } = call.request;
    const review = await Review.findById(reviewId);
    if (!review) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Review not found!",
      });
    }
    callback(null, review);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};
export const deleteReview = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const getReviewSoap = async (args, callback) => {
  try {
    const { reviewId } = args;
    const review = await Review.findById(reviewId);
    if (!review) {
      return callback({
        code: 404,
        message: "Review not found!",
      });
    }
    callback(null, { review: JSON.stringify(review) });
  } catch (err) {
    callback({
      code: 500,
      message: err.message,
    });
  }
};

const reviewService = {
  ReviewService: {
    ReviewServicePortType: {
      getReview: getReviewSoap,
    },
  },
};

const reviewWsdlPath = './wsdl/reviewService.wsdl';

export const startReviewSoapServer = (app) => {
  soap.listen(app, '/reviews/wsdl', reviewService, reviewWsdlPath, () => {
    console.log(`Review SOAP server running at http://localhost:8800/reviews/wsdl`);
  });
};