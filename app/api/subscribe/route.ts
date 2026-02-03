import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

type ResponseData = {
  message?: string;
  error?: string;
};

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json<ResponseData>(
      { error: 'Valid email required' },
      { status: 400 }
    );
  }

  try {
    // Create transporter using Gmail (App Password required)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ojjfred@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Read book cover image and convert to base64
    const coverPath = path.join(process.cwd(), 'public', 'book-cover.png');
    let coverBase64 = '';

    try {
      const coverBuffer = fs.readFileSync(coverPath);
      coverBase64 = coverBuffer.toString('base64');
    } catch (err) {
      console.error('Could not read book cover:', err);
    }

    // Email to yourself (new subscriber notification)
    const mailOptions = {
      from: 'ojjfred@gmail.com',
      to: 'ojjfred@gmail.com',
      subject: '🔥 New Urban Dreamer Subscriber',
      html: `
        <div style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #e8e8e8; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ff4500; border-bottom: 2px solid #ff4500; padding-bottom: 10px; font-size: 32px;">
              NEW SUBSCRIBER
            </h1>
            <p style="color: #b8b8b8; font-size: 16px; line-height: 1.6; margin-top: 20px;">
              Someone just joined the waiting list for <strong style="color: #ff8c00;">The Urban Dreamer</strong>.
            </p>
            <div style="background: #1a1a1a; padding: 20px; margin: 20px 0; border-left: 4px solid #ff4500;">
              <p style="margin: 0; color: #e8e8e8; font-size: 18px;">
                <strong style="color: #ff4500;">Email:</strong> ${email}
              </p>
              <p style="margin: 10px 0 0 0; color: #888888; font-size: 14px;">
                <strong>Subscribed:</strong> ${new Date().toLocaleString('en-KE', {
                  timeZone: 'Africa/Nairobi',
                })}
              </p>
            </div>

            ${
              coverBase64
                ? `
            <div style="text-align: center; margin: 30px 0;">
              <img src="cid:bookcover" alt="The Urban Dreamer" style="max-width: 300px; border-radius: 8px; box-shadow: 0 10px 40px rgba(255, 69, 0, 0.3);" />
            </div>
            `
                : ''
            }

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333333;">
              <p style="color: #666666; font-size: 12px; margin: 5px 0;">
                THE URBAN DREAMER • Book One of the WeDemo Trilogy
              </p>
            </div>
          </div>
        </div>
      `,
      attachments: coverBase64
        ? [
            {
              filename: 'book-cover.png',
              content: coverBase64,
              encoding: 'base64',
              cid: 'bookcover',
            },
          ]
        : [],
    };

    // Confirmation email to subscriber
    const confirmationMailOptions = {
      from: 'ojjfred@gmail.com',
      to: email,
      subject: "You're on the list — The Urban Dreamer",
      html: `
        <div style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #e8e8e8; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ff4500; text-align: center;">THE URBAN DREAMER</h1>

            ${
              coverBase64
                ? `
            <div style="text-align: center; margin: 30px 0;">
              <img src="cid:bookcover" alt="The Urban Dreamer" style="max-width: 100%; border-radius: 8px;" />
            </div>
            `
                : ''
            }

            <p style="text-align: center; font-size: 18px;">
              You're on the list.
            </p>

            <p style="color: #a8a8a8; line-height: 1.8;">
              This is not a success story. This is an autopsy of a promise—the promise that following the old script guarantees safety.
            </p>

            <p style="color: #888888; text-align: center; margin-top: 40px;">
              No spam. No bullshit. Just the truth.
            </p>
          </div>
        </div>
      `,
      attachments: coverBase64
        ? [
            {
              filename: 'book-cover.png',
              content: coverBase64,
              encoding: 'base64',
              cid: 'bookcover',
            },
          ]
        : [],
    };

    // Send emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMailOptions);

    console.log(`New subscriber: ${email}`);

    return NextResponse.json<ResponseData>(
      { message: 'Subscription successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json<ResponseData>(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
