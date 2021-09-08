const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const users = require('./routes/api/users');

//const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`;
const mongoUri = 'mongodb://localhost:27017/flickbase'
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database connected..⌛ ');
  })
  .catch((e) => {
    console.log(`Database Connection Error ${e}`);
  });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use('/api/users',users);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server runnig on port ${port} 🚀`);
});
