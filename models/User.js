import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  shopName: { type: String, required: true },
  tell: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  logo: { type: String }, // base64 string
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;
