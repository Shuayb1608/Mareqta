const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'stripe-samples/identity/modal',
    version: '0.0.1',
    url: 'https://github.com/stripe-samples',
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      if (stripe.identity && stripe.identity.verificationSessions) {
        const verificationSession = await stripe.identity.verificationSessions.create({
          type: 'document',
          options: {
              document: {
                  require_live_capture: true,
                  require_matching_selfie: true,
              }
          },
          metadata: {
            user_id: '{{USER_ID}}',
          },
        });

        res.send({ client_secret: verificationSession.client_secret });
      } else {
        throw new Error('Stripe identity.verificationSessions not available.');
      }
    } catch (e) {
      console.log(e);
      return res.status(400).send({ error: { message: e.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
