const User = require('../Model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'your_jwt_secret'; 

function generateToken(user){
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
      };
    
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 
    //   webtoken is expire into the 1 hour
}
 async function registerUser(req, res){
    const {userName , email , password} = req.body;
    console.log("**User deatails " , req.body);
    try {
        const user = new User({
            userName,
            email,
            password
        })
        await user.save();
        // Generate the jwt token of the user is here
        const token = generateToken(user);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle validation and other errors
    }
 };
// Desing the login controller of user using hashpassword 
 async function loginUser(req, res){
   const {email, password} = req.body;

   try {
      const user = await User.findOne({email});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
        // compare entered password and strored password is mathcd or not
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
           return res.status(401).json({ error: 'Invalid credentials' });
        }
         const token = generateToken(user); // Generate a JWT for the user
         res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle server errors
    }
 };
 async function getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password'); // Exclude the password field
      res.status(200).json(users); // Send the list of users
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle server errors
    }
  }

  module.exports = {
    registerUser, loginUser, getAllUsers
  }