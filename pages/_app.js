// pages/_app.js
import React, { useState } from 'react';
import { SWRConfig } from 'swr';
import fetch from '../lib/fetchJson';
import '../styles/globals.css';
import Head from 'next/head';


function MyApp({ Component, pageProps }) {
  

  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
        <Head>
          <script
            src="https://widgets.marqeta.com/marqetajs/2.0.0/marqeta.min.js"
            type="text/javascript"
          ></script>
        </Head>
        <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
