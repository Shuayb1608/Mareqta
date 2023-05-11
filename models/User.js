import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mqUserToken: {
    type: String,
    required: true,
  },
  mqUser: {
    type: Object,
    required: true,
  },
  mqCard: {
    type: Object,
    required: true,
  },
});

let User;

// Check if the model is already compiled
if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', userSchema);
}

export default User;
