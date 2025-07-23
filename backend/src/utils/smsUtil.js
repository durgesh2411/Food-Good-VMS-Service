import twilio from "twilio";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../.env');
dotenv.config({ path: envPath });

export async function sendSMS({ to, message }) {
  // console.log("to", to);
  // console.log("message", message);
  if (!(to || message)) {
    console.error("Missing 'to' number or 'message' content.");
    return;
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) {
      console.error("Twilio credentials are not set.");
      return;
    }

    const client = twilio(accountSid, authToken);

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!fromNumber) {
      console.error("Twilio phone number is not set.");
      return;
    }

    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });

    console.log("SMS sent successfully:", response.sid);
  } catch (error) {
    console.error("Failed to send SMS:", error.message);
  }
}
