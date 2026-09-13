require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const db = mongoose.connection.db;
    const users = db.collection('users');
    await users.updateOne({ email: 'testuser@example.com' }, { $set: { isEmailVerified: true } });
    console.log('User verified');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
