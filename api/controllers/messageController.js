import createError from "../utils/createError.js";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import grpc from '@grpc/grpc-js'
import soap from "soap";

export const createMessage = async (req, res, next) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  try {
    const savedMessage = await newMessage.save();
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};


export const getMessageExpress = async (req, res, next) => {
  try {
    const { conversationId, content, senderId } = req.body;
    const newMessage = new Message({
      conversationId,
      content,
      senderId,
    });
    const savedMessage = await newMessage.save();
    res.status(200).send(savedMessage);
  } catch (err) {
    next(err);
  }
};


export const getMessageGrpc = async (call, callback) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};
export const sendMessageSoap = async (args, callback) => {
  try {
    const { conversationId, content, senderId } = args;
    const newMessage = new Message({
      conversationId,
      content,
      senderId,
    });
    const savedMessage = await newMessage.save();
    callback(null, { message: JSON.stringify(savedMessage) });
  } catch (err) {
    callback({
      code: 500,
      message: err.message,
    });
  }
}

const messageService = {
  MessageService: {
    MessageServicePortType: {
      sendMessage: sendMessageSoap,
    },
  },
};

const messageWsdlPath = './wsdl/messageService.wsdl';

export const startMessageSoapServer = (app) => {
  soap.listen(app, '/messages/wsdl', messageService, messageWsdlPath, () => {
    console.log(`Message SOAP server running at http://localhost:8800/messages/wsdl`);
  });
};