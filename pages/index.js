import Layout from '../components/Layout';
import withSession from '../lib/session';
import marqetaClient from '../lib/marqetaClient'
import { useState } from 'react';

// ... (the rest of the code remains unchanged)


const callProcessTransactionApi = async (cardToken, userToken, amount) => {
  try {
    const response = await fetch('/api/process-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardToken: cardToken,
        userToken: userToken,
        amount: amount,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Transaction failed:', error.message);
  }
};

function formatExpirationDate(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  return `${month}/${year}`;
};

const Home = ({ user, cardPANLastFour, currentBalance }) => {
  const [showCvv, setShowCvv] = useState(false);
  const [showPan, setShowPan] = useState(false);

  const toggleCvvVisibility = () => {
    setShowCvv(!showCvv);
  };

  const togglePanVisibility = () => {
    setShowPan(!showPan);
  };

  const handleTransaction = async () => {
  try {
    await callProcessTransactionApi(user.mqCard.token, user.mqUser.token, '10');
    // You can replace 10 with the desired transaction amount
    console.log('Transaction successful');
  } catch (error) {
    console.error('Transaction failed:', error.message);
  }
};

 return (
     <Layout>
      <div className="my-12">
        <div className="inline-block">
          <div
            className="px-8 py-8 bg-green-900 text-white w-96 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <h3 className="pt-8 text-4xl font-bold font-mono">
              ${currentBalance}
            </h3>
            <div className="text-center mt-8 leading-none flex justify-between w-full">
              <span className="inline-flex items-center leading-none text-sm font-mono">
                {showPan
                  ? user.mqCard.pan
                  : `**** **** **** ${cardPANLastFour}`}
              </span>
            </div>
            <div className="text-center mt-4 leading-none flex justify-between w-full">
              <span className="inline-flex items-center leading-none text-sm font-mono">
                Mr. Shuayb Ahmed
              </span>
            </div>
            <div className="text-center mt-4 leading-none flex justify-between w-full">
              <span className="inline-flex items-center leading-none text-sm font-mono">
                Expires: {formatExpirationDate(user.mqCard.expiration_time)}
              </span>
            </div>
            <div className="text-right mt-8 leading-none flex justify-between w-full">
              <span className="inline-flex items-center leading-none text-sm font-mono">
                {showCvv ? user.mqCard.cvv_number : '***'}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-around w-full">
            <button
              onClick={togglePanVisibility}
              className="text-xs text-white bg-blue-500 px-2 py-1 rounded-lg"
            >
              {showPan ? 'Hide Account Number' : 'Show Account Number'}
            </button>
            <button
              onClick={toggleCvvVisibility}
              className="text-xs text-white bg-blue-500 px-2 py-1 rounded-lg"
            >
              {showCvv ? 'Hide CVV' : 'Show CVV'}
            </button>
          </div>
        </div>
      </div>
       <div className="mt-4 flex justify-center w-full">
        <button
          onClick={handleTransaction}
          className="text-xs text-white bg-blue-500 px-4 py-2 rounded-lg"
        >
          Process Transaction
        </button>
      </div>
    </Layout>
  );
  
};

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get('user')

  console.log('User object:', user); // Add this line

  if (!user) {
    return {
      redirect: {
        destination: '/signup',
        permanent: false,
      },
    }
  }

  console.log('MQUser object:', user.mqUser) // Add this line

  if(!user.mqUser) {
    return{
      redirect: {
        destination: '/signup',
        permanent: false,
      },
    }
  }
console.log('USER STATUS CHECK', user.mqUser.status)
console.log('USER KYC CHECK', user.mqUser.metadata.kyc_done);
if(user.mqUser.status !== 'ACTIVE' ) {
  if(user.mqUser.metadata.kyc_done === "true") {
    console.log('Redirecting to /submitted');
    return{
      redirect: {
        destination: '/submitted',
        permanent: false,
      },
    }
  } else {
    console.log('Redirecting to /kyc-check');
    return{
      redirect: {
        destination: `/kyc-check?email=${user.mqUser.email}`,
        permanent: false,
      },
    }
  }
}

  // TODO: Get the users balance via /balances/{user.mqUser.token}
  const mqBalanceResponse = await marqetaClient.get(`/balances/${user.mqUser.token}`)
  const balance = mqBalanceResponse.data
  console.log('Balance: ', balance)

  return {
    props: {
      user: req.session.get('user'),
      cardPANLastFour: user.mqCard.last_four,
      currentBalance: balance.gpa.available_balance,
    },
  }
})

export default Home