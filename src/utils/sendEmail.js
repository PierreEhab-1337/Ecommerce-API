import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASSCODE
    }
});

const sendEmail = async ({ to, subject, text, html }) => {
    const info = await transporter.sendMail({
        from: `"Koda Store" <${process.env.USER_EMAIL}>`,
        to,
        subject,
        text,
        html, 
    });

    // console.log("Email sent:", info.messageId);
};

// ----------------------------------- OTP Email Template -----------------------------------

export const otpEmailTemplate = (otp, expirationTimeInMinutes) => `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 40px 0;">
        <tr>
        <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <tr>
                <td style="background:#4f46e5; padding:24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:20px;">KODA STORE</h1>
                </td>
            </tr>
            <tr>
                <td style="padding:32px; text-align:center;">
                <p style="font-size:16px; color:#333333; margin:0 0 16px;">Your verification code is:</p>
                <div style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#4f46e5; margin:16px 0;">
                    ${otp}
                </div>
                <p style="font-size:14px; color:#888888; margin:16px 0 0;">This code expires in ${expirationTimeInMinutes} minutes.</p>
                </td>
            </tr>
            <tr>
                <td style="background:#fafafa; padding:16px; text-align:center;">
                <p style="font-size:12px; color:#aaaaaa; margin:0;">If you didn't request this, you can ignore this email.</p>
                </td>
            </tr>
            </table>
        </td>
        </tr>
    </table>
    </body>
    </html>
    `;

// ----------------------------------- Order Email Template -----------------------------------

export const orderEmailTemplate = (order) => `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0"
  style="background-color:#f4f4f7; padding:40px 0;">

  <tr>
    <td align="center">

      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#4f46e5; padding:24px; text-align:center;">
            <h1 style="color:#ffffff; margin:0;">
              KODA STORE
            </h1>

            <p style="color:#ffffff; margin:8px 0 0;">
              Order Confirmation
            </p>
          </td>
        </tr>

        <!-- Order Information -->
        <tr>
          <td style="padding:30px;">

            <h2 style="color:#333333;">
              Thank you for your order!
            </h2>

            <p style="color:#555555;">
              Your order has been successfully placed.
            </p>

            <p>
              <strong>Order ID:</strong> ${order._id}
            </p>

            <p>
              <strong>Payment Method:</strong> ${order.paymentMethod}
            </p>

            <p>
              <strong>Order Status:</strong> ${order.status}
            </p>

            <hr style="border:0; border-top:1px solid #eeeeee;">

            <h3>Order Items</h3>

            <table width="100%" cellpadding="8" cellspacing="0"
              style="border-collapse:collapse;">

              <tr style="background:#f4f4f7;">
                <th align="left">Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>

              ${order.items
                .map(
                  (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td align="center">${item.quantity}</td>
                      <td align="right">${item.price} EGP</td>
                    </tr>
                  `,
                )
                .join("")}
            </table>

            <hr style="border:0; border-top:1px solid #eeeeee;">

            <p>
              <strong>Subtotal:</strong>
              ${order.subtotal} EGP
            </p>

            <p>
              <strong>Shipping Fee:</strong>
              ${order.shippingFee} EGP
            </p>

            <p>
              <strong>Tax:</strong>
              ${order.tax} EGP
            </p>

            <h2 style="color:#4f46e5;">
              Total: ${order.totalPrice} EGP
            </h2>

            <hr style="border:0; border-top:1px solid #eeeeee;">

            <h3>Shipping Address</h3>

            <p>
              <strong>Name:</strong>
              ${order.shippingAddress.fullName}
            </p>

            <p>
              <strong>Phone:</strong>
              ${order.shippingAddress.phone}
            </p>

            <p>
              <strong>Address:</strong>
              ${order.shippingAddress.address}
            </p>

            <p>
              <strong>City:</strong>
              ${order.shippingAddress.city}
            </p>

            <p>
              <strong>Postal Code:</strong>
              ${order.shippingAddress.postalCode}
            </p>

            ${
              order.customerNote
                ? `
                  <hr style="border:0; border-top:1px solid #eeeeee;">

                  <h3>Customer Note</h3>

                  <p>
                    ${order.customerNote}
                  </p>
                `
                : ""
            }

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fafafa; padding:16px; text-align:center;">
            <p style="font-size:12px; color:#aaaaaa; margin:0;">
              Thank you for shopping with KODA STORE.
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>

</table>

</body>
</html>
`;

export default sendEmail;
           
