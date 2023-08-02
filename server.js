const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;
const User = require('./models/user');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://192.168.0.2:27017/lifeary', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to the Database.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
// get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a user
app.post('/users', async (req, res) => {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
    //console.log("user",user,"newUser", newUser, "req.body",req.body);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get user for authentication
app.get('/users/:userName', async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName });
    if (user == null) {
      // Not found
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//update user
app.put('/update/:name', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Updating the user's details from the request body
    user.age = req.body.age || user.age;
    user.email = req.body.email || user.email;
    // Check if recognization object is provided in the request body
    if (req.body.recognization) {
      user.recognization.push(req.body.recognization);
    }
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//clean recognization
app.put('/clean/:name', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.recognization =[];
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});