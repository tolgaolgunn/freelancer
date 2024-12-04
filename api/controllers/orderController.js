import createError from "../utils/createError.js";
import Order from "../models/orderModel.js";
import Gig from "../models/gigModel.js";
import Stripe from "stripe";
import { sendMail } from "../utils/sendMail.js";
import User from "../models/userModel.js";
export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  const gig = await Gig.findById(req.params.id);

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
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await newOrder.save();
  const buyer = await User.findById(req.userId);
    if (buyer) {
      const subject = "Yeni Sipariş Onayı Gerekiyor";
      const text = `Merhaba, siparişinizi onaylamak için aşağıdaki bağlantıya tıklayın: \n http://localhost:5173/order/approve/${newOrder._id}`;
      const html = `<p>Merhaba ${buyer.name},</p><p>Siparişinizi onaylamak için aşağıdaki bağlantıya tıklayın:</p><a href="http://localhost:5173/order/approve/${newOrder._id}">Siparişi Onayla</a>`;

      await sendMail(buyer.email, subject, text, html); 
    }

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrders = async (req, res, next) => {

  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

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
export const approveOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, buyerId: req.userId },
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
};
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


