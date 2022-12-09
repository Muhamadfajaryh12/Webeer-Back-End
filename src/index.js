const express = require('express');
const cors = require('cors');
const mongoose = require('./config/database');

const baseURL = '/api';
const PORT = process.env.PORT || 3000;
const app = express();

const jobs = require('./routes/jobRouter');
const users = require('./routes/userRouter');
const discussions = require('./routes/discussionRouter');
const category = require('./routes/discussionCategoryRouter');
const reply = require('./routes/discussionReplyRouter');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(`${baseURL}/jobs`, jobs);
app.use(`${baseURL}/users`, users);
app.use(`${baseURL}/discussions`, discussions);
app.use(`${baseURL}/discussionscategory`, category);
app.use(`${baseURL}/discussions/reply`, reply);
app.listen(PORT, () => {
  console.log(`Server Started at PORT ${PORT}`);
});