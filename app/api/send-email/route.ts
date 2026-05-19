import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '../../lib/sendEmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // sendEmail.ts dosyasındaki fonksiyonu çağırıyoruz
    const result = await sendOrderConfirmationEmail(body);

    if (result.success) {
      return NextResponse.json({ message: "Email sent successfully" });
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}