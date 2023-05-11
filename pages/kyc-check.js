import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const KycCheck = ({}) => {
  const router = useRouter();
  const { email } = router.query;
  useEffect(() => {
    console.log('key', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    const verifyButton = document.getElementById('verify-button');
    verifyButton.addEventListener('click', async () => {
      try {
        const { client_secret } = await fetch(`/api/create-verification-session`, {
          method: 'POST',
        }).then((r) => r.json());

        const { error } = await stripe.verifyIdentity(client_secret);
        if (!error) {
          await fetch('/api/update-user-kyc-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
         
          window.location.href = `/submitted`;
        } else {
          alert(error.message);
        }
      } catch (e) {
        alert(e.message);
      }
    });
  }, [email]);

  return (
    <>
      <Head>
        <title>Stripe Identity Sample</title>
        <link rel="stylesheet" href="/css/normalize.css" />
        <link rel="stylesheet" href="/css/global.css" />
        <script src="https://js.stripe.com/v3/"></script>
      </Head>
      <div className="sr-root flex flex-col items-center justify-center min-h-screen py-2">
        <div className="sr-main">
          <section className="container">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Verify your identity to book</h1>
              <h4 className="text-lg mb-4">Get ready to take a photo of your ID and a selfie</h4>
              <button id="verify-button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Verify me</button>
            </div>
          </section>
        </div>
      </div>  
    </>
  );
};
export default KycCheck;
