// Middleware to handle order approval or rejection
import User from "../models/userModel.js";
import { sendMail } from "../utils/sendMail.js";
import createError from "../utils/createError.js";
export const orderActionMiddleware = async (req, res, next) => {
  try {
      const buyer = await User.findById(req.userId);
      if (!buyer) {
          return next(createError(404, "User not found."));
      }

      const newOrder = req.newOrder; // Order nesnesi req üzerinden alınır
      if (!newOrder) {
          return next(createError(400, "Order data is missing."));
      }

      const subject = "Yeni Sipariş Onayı Gerekiyor";
      const text = `Merhaba, siparişinizi onaylamak veya reddetmek için aşağıdaki bağlantıları kullanın: \n Onayla: http://localhost:5173/payment/${newOrder._id} \n Reddet: http://localhost:5173/home`;

      const html = `
          <p>Merhaba ${buyer.username},</p>
          <p>Siparişinizi onaylamak veya reddetmek için aşağıdaki butonları kullanabilirsiniz:</p>
          <form action="http://localhost:5173/payment/${newOrder._id}" method="get" style="display: inline;">
              <button type="submit" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; border: none; cursor: pointer;">Onayla</button>
          </form>
          <form action="http://localhost:5173/home" method="get" style="display: inline; margin-left: 10px;">
              <button type="submit" style="padding: 10px 15px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px; border: none; cursor: pointer;">Reddet</button>
          </form>
      `;

      await sendMail(buyer.email, subject, text, html);
      next();
  } catch (error) {
      console.error(error);
      next(error);
  }
};


