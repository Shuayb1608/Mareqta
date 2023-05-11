// pages/submitted.js
import React, { useEffect, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

function Submitted() {
  const router = useRouter();

  const handleSignOut = async () => {
    const response = await fetch('/api/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.isSignedIn === false) {
      router.push('/signin');  // Redirect to login page after sign out
    } else {
      console.error('Failed to sign out');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <p className="text-center mb-4">Your KYC is still being processed. Please wait for verification. Once verified, you will be notified via email and can log back in to use the app.</p>
      <button
        onClick={handleSignOut}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign Out
      </button>
      {/* Render other content here */}
    </div>
  );
}

export default Submitted;
