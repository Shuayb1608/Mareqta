import withSession from '../../lib/session';
import connectToDatabase from '../../lib/db';
import User from '../../models/User';
import marqetaClient from '../../lib/marqetaClient';

import bcrypt from 'bcrypt';

export default withSession(async (req, res) => {
  console.log('Starting sign-in process...');
  try {
    const { email, password } = await req.body;
    console.log(`Email: ${email}, Password: ${password}`);

    console.log('Connecting to database...');
    await connectToDatabase();

    console.log('Finding user...');
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Checking password...');
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('Incorrect password');
      return res.status(401).json({ error: 'Incorrect password' });
    }

    console.log('Retrieving Marqeta user data...');
    const mqUserResponse = await marqetaClient.get(`/users/${user.mqUser.token}`);
    const updatedMqUser = mqUserResponse.data;

    console.log('signin.js updatedMqUser = ', updatedMqUser);

    console.log('Retrieving Marqeta card data...');
    const mqCardsResponse = await marqetaClient.get(`/cards/${user.mqCard.token}`);
    const updatedMqCard = mqCardsResponse.data;

    console.log('Updating user object with latest Marqeta data...');
    user.mqUser = updatedMqUser;
    user.mqCard = updatedMqCard;

    console.log('user.mqUser before being saved to the DB', user.mqUser);

    console.log('Updating user document in the database...');
    await User.findOneAndUpdate({ email }, { mqUser: updatedMqUser, mqCard: updatedMqCard });

    console.log('Setting session data...');
    req.session.set('user', user);
    await req.session.save();

    console.log('Sign-in process completed successfully.');
    res.json(user);
  } catch (error) {
    console.error('Error during sign-in process:', error);
    res.status(500).json({ error: error.message });
  }
});
