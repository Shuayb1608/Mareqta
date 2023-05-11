import withSession from '../../lib/session';
import connectToDatabase from '../../lib/db';
import User from '../../models/User';
import marqetaClient from '../../lib/marqetaClient';

export default withSession(async (req, res) => {
  // Connect to MongoDB
  await connectToDatabase();

  const { email } = req.body;

  try {
    // Retrieve user document from MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's metadata in Marqeta
    const mqUserResponse = await marqetaClient.put(`/users/${user.mqUser.token}`, {
            metadata: {
              kyc_done : true
          }
          
    });

    console.log(`new user's updated mquser values`, mqUserResponse);

    // Retrieve the updated user data from Marqeta
    const updatedMqUserResponse = await marqetaClient.get(`/users/${user.mqUser.token}`);
    const updatedMqUser = updatedMqUserResponse.data;

    // Update user document in MongoDB with the updated mqUser data
    user.mqUser = updatedMqUser;
    await User.findOneAndUpdate({ email }, { mqUser: updatedMqUser });

    // Respond with success status
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the user KYC status.' });
  }
});
