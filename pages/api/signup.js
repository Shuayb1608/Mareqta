import withSession from '../../lib/session';
import marqetaClient from '../../lib/marqetaClient';
import connectToDatabase from '../../lib/db';
import User from '../../models/User';
import bcrypt from 'bcrypt';


export default withSession(async (req, res) => {
  // Connect to MongoDB
  await connectToDatabase();

  const {
    email,
    firstName,
    lastName,
    password,
    birthDate,
    address1,
    city,
    state,
    postalCode,
    phone,
  } = await req.body;
  console.log('Request session data:', req.session.get('user'));
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

  try {
    // Save user data and mqUser token to MongoDB

    // 1. Create the user on the Marqeta Platform.
    const mqUserResponse = await marqetaClient.post('/users', {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      birth_date: birthDate,
      address1: address1,
      city: city,
      state: state,
      country: "GB",
      postal_code: postalCode,
      phone: phone,
      account_holder_group_token: "7de74147-b7a7-495b-9c2c-f6f3bb0884e2",
      metadata: {
       kyc_done: false
      }
    });
    const mqUser = mqUserResponse.data;
    console.log('Created user: ', mqUser);

    const user = new User({
      email:email,
      firstName:firstName,
      lastName:lastName,
      password: hashedPassword, // Save the hashed password instead of the plain text password
      mqUserToken: mqUser.token,
    });
    

    // Update the user object with the mqUserToken
    user.mqUserToken = mqUser.token;
    

    // Retrieve the latest mqUser data
    const mqUserLatestResponse = await marqetaClient.get(`/users/${mqUser.token}`);
    const updatedMqUser = mqUserLatestResponse.data;

    // 2. Create a card for the Marqeta user, linked to the pre-defined card product.
    const mqCardsResponse = await marqetaClient.post('/cards', {
      card_product_token: 'a0996d01-34aa-4f4a-9507-de9a946898d7',
      user_token: updatedMqUser.token
    }, {
      params: {
        show_cvv_number: true,
        show_pan: true
      }
    });
    

    const mqCard = mqCardsResponse.data;
    console.log('Created card: ', mqCard);

    // Retrieve the latest mqCard data
    const mqCardResponse = await marqetaClient.get(`/cards/${mqCard.token}`);
    const updatedMqCard = mqCardResponse.data;

    // Update user object with the latest mqUser and mqCard data
    user.mqUser = updatedMqUser;
    user.mqCard = updatedMqCard;
    await user.save();

    // Save updated user data to the session
    req.session.set('user', user);
    await req.session.save();
    console.log('User saved in the session:', user);


    console.log('User KYC status is not active. Redirecting to KYC check page.');
    res.status(200).json({
      success: true,
      mqUserStatus: updatedMqUser.status,
      user: email,
      redirectToKycCheck: true,
      redirectUrl: `/submitted?mqUserStatus=${updatedMqUser.status}`,
      userId: updatedMqUser.status,
    });


  } catch (error) {
    console.error(error);
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json({ error: error.data });
  }
});
