import createError from "../utils/createError.js";
import Conversation from "../models/conversationModel.js";
import grpc from "@grpc/grpc-js";
import soap from "soap";

export const createConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).send(savedConversation);
  } catch (err) {
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          // readBySeller: true,
          // readByBuyer: true,
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });
    if (!conversation) return next(createError(404, "Not found!"));
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

export const getConversationExpress = async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};

export const getConversationGrpc = async (call, callback) => {
  try {
    const { conversationId } = call.request;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Conversation not found!",
      });
    }
    callback(null, conversation);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};

export const getConversationSoap = async (args, callback) => {
  try {
    const { conversationId } = args;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return callback({
        code: 404,
        message: "Conversation not found!",
      });
    }
    callback(null, { conversation: JSON.stringify(conversation) });
  } catch (err) {
    callback({
      code: 500,
      message: err.message,
    });
  }
};

const conversationService = {
  ConversationService: {
    ConversationServicePortType: {
      getConversation: getConversationSoap,
    },
  },
};


const conversationWsdlPath = './wsdl/conversationService.wsdl';

export const startConversationSoapServer = (app) => {
  soap.listen(app, '/conversations/wsdl', conversationService, conversationWsdlPath, () => {
    console.log(`Conversation SOAP server running at http://localhost:8800/conversations/wsdl`);
  });
};