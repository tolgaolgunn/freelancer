import createError from "../utils/createError.js";
import Order from "../models/orderModel.js";
import Gig from "../models/gigModel.js";
import Stripe from "stripe";
import { sendMail } from "../utils/sendMail.js";
import User from "../models/userModel.js";
import {orderActionMiddleware} from "../middleware/orderActionMiddleware.js";
import grpc from "@grpc/grpc-js";
import soap from "soap";
export const intent = async (req, res, next) => {
  try {
      const stripe = new Stripe(process.env.STRIPE);
      const gig = await Gig.findById(req.params.id);

      if (!gig) {
          return next(createError(404, "Gig not found."));
      }

      const paymentIntent = await stripe.paymentIntents.create({
          amount: gig.price * 100,
          currency: "usd",
          automatic_payment_methods: {
              enabled: true,
          },
      });

      const newOrder = new Order({
          gigId: gig._id,
          img: gig.cover,
          title: gig.title,
          buyerId: req.userId,
          sellerId: gig.userId,
          price: gig.price,
          payment_intent: paymentIntent.id,
          buyerName:req.username,
          sellerName:req.username,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await newOrder.save();

      const buyer = await User.findById(req.userId);
      if (buyer) {
          const subject = "Yeni Sipariş Onayı Gerekiyor";
          const text = `Merhaba, siparişinizi onaylamak veya reddetmek için aşağıdaki bağlantıları kullanın: \n Onayla: http://localhost:5173/payment/${newOrder._id} \n Reddet: http://localhost:5173/home`;

          const html = `
              <p>Merhaba ${buyer.username},</p>
              <p>Siparişinizi onaylamak veya reddetmek için aşağıdaki butonları kullanabilirsiniz:</p>
              <form action="http://localhost:5173/pay/${gig._id}" method="get" style="display: inline;">
                  <button type="submit" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; border: none; cursor: pointer;">Onayla</button>
              </form>
              <form action="http://localhost:5173/" method="get" style="display: inline; margin-left: 10px;">
                  <button type="submit" style="padding: 10px 15px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px; border: none; cursor: pointer;">Reddet</button>
              </form>
          `;

          await sendMail(buyer.email, subject, text, html);
      }

      res.status(200).send({
          clientSecret: paymentIntent.client_secret,
      });
  } catch (error) {
      console.error(error);
      next(error);
  }
};

export const getOrders = async (req, res, next) => {

  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    }).populate('sellerId', 'username').populate('buyerId', 'username');

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};
export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};
export const approveOrder = [
  // orderActionMiddleware,
  async (req, res, next) => {
    try {
      const order = await Order.findOneAndUpdate(
        { _id: req.params.id, buyerId: req.userId},
        { $set: { isApproved: true } },
        { new: true }
      );

      if (!order) {
        return next(createError(404, "Order not found or not authorized."));
      }

      order.isApproved = true;
      await order.save();

      res.status(200).send({ message: "Order has been approved.", order });
    } catch (err) {
      next(err);
    }
  },
];

export const removeExpiredOrders = async () => {
  const now = new Date();

  try {
    const expiredOrders = await Order.updateMany(
      {
        isApproved: false,
        isCompleted: false,
        expiresAt: { $lte: now },
      },
      {
        $set: { isCompleted: true },
      }
    );

    console.log(`${expiredOrders.modifiedCount} expired orders were marked as completed.`);
  } catch (err) {
    console.error("Error handling expired orders:", err);
  }
};

export const getOrderExpress = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    }).populate('sellerId', 'username').populate('buyerId', 'username');

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrderGrpc = async (call, callback) => {
  try {
    const { orderId } = call.request;
    const order = await Order.findById(orderId);
    if (!order) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Order not found!",
      });
    }
    callback(null, order);
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: err.message,
    });
  }
};

export const getOrderSoap = async (args, callback) => {
  try {
    const { orderId } = args;
    const order = await Order.findById(orderId);
    if (!order) {
      return callback({
        code: 404,
        message: "Order not found!",
      });
    }
    callback(null, { order: JSON.stringify(order) });
  } catch (err) {
    callback({
      code: 500,
      message: err.message,
    });
  }
};

const orderService = {
  OrderService: {
    OrderServicePortType: {
      getOrder: getOrderSoap,
    },
  },
};

const orderWsdlPath = './wsdl/orderService.wsdl';

export const startOrderSoapServer = (app) => {
  soap.listen(app, '/orders/wsdl', orderService, orderWsdlPath, () => {
    console.log(`Order SOAP server running at http://localhost:8800/orders/wsdl`);
  });
};
