import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, timestamp, userAgent, referrer } = body;

    // Log the CV request
    console.log('📄 CV REQUEST RECEIVED:');
    console.log('  Name:', name);
    console.log('  Email:', email);
    console.log('  Timestamp:', timestamp);
    console.log('  User Agent:', userAgent);
    console.log('  Referrer:', referrer);
    console.log('  IP Address:', request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown');
    console.log('---');

    // Send notification email to you
    try {
      await sendNotificationEmail({
        name,
        email,
        timestamp,
        userAgent,
        referrer,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      });
      console.log('✅ Notification email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send notification email:', emailError);
    }

    // Send CV to the requester
    try {
      await sendCVToRequester({ name, email });
      console.log('✅ CV sent to requester successfully');
    } catch (cvError) {
      console.error('❌ Failed to send CV to requester:', cvError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'CV request processed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing CV request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process CV request' },
      { status: 500 }
    );
  }
}

// Send notification email to you
async function sendNotificationEmail(data: {
  name: string;
  email: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
  ip: string;
}) {
  const emailContent = `
📄 NOWA PROŚBA O CV

Dane osoby:
• Imię: ${data.name}
• Email: ${data.email}
• Data: ${new Date(data.timestamp).toLocaleString('pl-PL')}

Informacje techniczne:
• IP: ${data.ip}
• User Agent: ${data.userAgent}
• Referrer: ${data.referrer}

---
Wysłane z portfolio: ${process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000'}
  `.trim();

  // Check if we have a valid Resend API key
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
    console.log('\n📧 EMAIL NOTIFICATION (DEVELOPMENT MODE):');
    console.log(emailContent);
    console.log('---\n');
    console.log('⚠️  Resend API key not configured. Email not sent.');
    return;
  }

  await resend.emails.send({
    from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
    to: process.env.CV_NOTIFICATION_EMAIL || 'your-email@example.com',
    subject: '📄 Nowa prośba o CV',
    text: emailContent,
  });
}

// Send CV to the requester
async function sendCVToRequester(data: { name: string; email: string }) {
  // Read CV file
  const cvPath = path.join(process.cwd(), 'public', 'cv', 'cv.txt');
  const cvContent = fs.readFileSync(cvPath, 'utf8');

  const emailContent = `
Cześć ${data.name}!

Dziękuję za zainteresowanie moim CV. W załączniku znajdziesz aktualne CV.

Jeśli masz pytania lub chciałbyś porozmawiać o możliwościach współpracy, śmiało napisz!

Pozdrawiam,
Łukasz Bernatowicz

---
CV w załączniku
  `.trim();

  // Check if we have a valid Resend API key
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
    console.log('\n📧 CV EMAIL (DEVELOPMENT MODE):');
    console.log(`To: ${data.email}`);
    console.log(`Subject: Twoje CV - Łukasz Bernatowicz`);
    console.log(emailContent);
    console.log('---\n');
    console.log('⚠️  Resend API key not configured. CV email not sent.');
    return;
  }

  await resend.emails.send({
    from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
    to: data.email,
    subject: 'Twoje CV - Łukasz Bernatowicz',
    text: emailContent,
    attachments: [
      {
        filename: 'CV_Lukasz_Bernatowicz.txt',
        content: cvContent,
      },
    ],
  });
}

// Optional: Add GET method to check if endpoint is working
export async function GET() {
  return NextResponse.json({ 
    message: 'CV request endpoint is working',
    timestamp: new Date().toISOString()
  });
}
