import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';

const clientId = process.env.GOOGLE_CLIENT_ID;

async function verifyIdToken(idToken: string): Promise<TokenPayload> {
  try {
    const client = new OAuth2Client(clientId);
    const ticket: LoginTicket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload: TokenPayload = ticket.getPayload() as TokenPayload; // Type assertion
    return payload;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid ID token');
  }
}

export default verifyIdToken;