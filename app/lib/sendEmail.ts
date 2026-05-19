import nodemailer from 'nodemailer';

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  totalAmount: number;
  items: OrderItem[];
}

export async function sendOrderConfirmationEmail(details: OrderDetails) {
  // 1. SMTP Ayarları (.env.local dosyasından çekilecek)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  // 2. Satın alınan ürünleri HTML tablosuna dönüştürme
  const itemsHtml = details.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; color: #1A2E35; font-weight: bold;">${item.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; color: #666666; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; color: #1A2E35; text-align: right; font-weight: bold;">€${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  // 3. Profesyonel HTML E-posta Şablonu (BlendArtBook Renkleriyle)
  const htmlTemplate = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
      
      <div style="background-color: #C8102E; padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-style: italic; letter-spacing: -1px;">blendartbook</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">BE WHOEVER</p>
      </div>

      <div style="padding: 40px 30px 20px;">
        <h2 style="color: #1A2E35; margin-top: 0;">Thank you for your order, ${details.customerName}!</h2>
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
          We have successfully received your order. We are now processing it and will let you know once it's on the way. Below are your order details.
        </p>
      </div>

      <div style="padding: 0 30px;">
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">Order Number: <strong style="color: #1A2E35;">#${details.orderNumber}</strong></p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 10px 12px; border-bottom: 2px solid #dddddd; color: #1A2E35;">Item</th>
                <th style="text-align: center; padding: 10px 12px; border-bottom: 2px solid #dddddd; color: #1A2E35;">Qty</th>
                <th style="text-align: right; padding: 10px 12px; border-bottom: 2px solid #dddddd; color: #1A2E35;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align: right; padding: 15px 12px 0; font-weight: bold; color: #1A2E35;">Total Amount:</td>
                <td style="text-align: right; padding: 15px 12px 0; font-weight: bold; color: #C8102E; font-size: 18px;">€${details.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div style="padding: 40px 30px; text-align: center;">
        <a href="https://blendartbook.com/account" style="background-color: #C8102E; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">View Order Status</a>
        <p style="color: #999999; font-size: 12px; margin-top: 30px;">
          If you have any questions, please reply to this email or contact our support team.<br>
          © ${new Date().getFullYear()} BlendArtBook. All rights reserved.
        </p>
      </div>
    </div>
  `;

  // 4. E-postayı Gönder
  try {
    await transporter.sendMail({
      from: '"BlendArtBook" <info@blendartbook.com>', // Görünecek gönderici adı
      to: details.customerEmail,
      subject: `Order Confirmation #${details.orderNumber} - BlendArtBook`,
      html: htmlTemplate,
    });
    
    console.log(`Sipariş maili ${details.customerEmail} adresine başarıyla gönderildi.`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Mail gönderme hatası:", error);
    return { success: false, error };
  }
}