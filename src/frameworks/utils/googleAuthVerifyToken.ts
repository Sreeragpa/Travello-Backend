import { OAuth2Client } from 'google-auth-library';

interface IdTokenPayload {
  // Define the structure of your ID token payload here
  sub: string;
  email: string;
  // ... other properties
}

const clientId = process.env.GOOGLE_CLIENT_ID;

async function verifyIdToken(idToken: string): Promise<IdTokenPayload> {
  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload()   as IdTokenPayload; // Type assertion
    return payload;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid ID token');
  }
}

export default verifyIdToken;