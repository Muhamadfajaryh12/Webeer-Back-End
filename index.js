const express = require("express");
const mongoose = require("mongoose");
const winston = require('winston');
const app = express();
require("dotenv").config();
const jobsRoute = require('./routes/jobs');

const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const http = require('http').Server(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(cors());
//create a logger
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format:winston.format.combine(
        winston.format.colorize({all:true})
      )
    }),
    new winston.transports.File({ filename: 'error.log' ,level:'error'})
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' })
  ]
});

//routes
app.use('/api/jobs',jobsRoute);


//connect to mongodb atlas
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    logger.info("connected to mongoDb atlas");
  })
  .catch((error) => {
    logger.error(error.message);
  });

//start the server
app.listen(PORT, () => {
  logger.info(`Server started at PORT ${PORT}`);
});
