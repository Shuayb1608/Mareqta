import withSession from '../../lib/session';
import marqetaClient from '../../lib/marqetaClient';


async function processTransaction(cardToken, userToken, amount) {
  try {
    // Step 1: Check user's balance
   const userBalanceResponse = await marqetaClient.get(`/balances/${userToken}`);

    const userBalance = userBalanceResponse.data;

    if (userBalance.gpa.available_balance < amount) {
      throw new Error("Insufficient user balance");
    }

    console.log("check successful")

    // Step 3: Simulate the transaction using the common GPA card token
    await marqetaClient.post('/simulate/authorization', {
      card_token: cardToken,
      amount: amount,
      mid: '123456890', // Replace with a valid merchant ID number
    });
    console.log("check successful")

    console.log("Transaction processed");
  } catch (error) {
    console.error("Error processing transaction:", error.message);
  }
}


export default withSession(async (req, res) => {
  const { cardToken, userToken, amount } = req.body;

  try {
    await processTransaction(cardToken, userToken, amount);
    res.status(200).json({ message: 'Transaction processed' });
  } catch (error) {
    console.error('Error processing transaction:', error.message);
    res.status(500).json({ error: error.message });
  }
});
