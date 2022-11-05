const express = require ("express");
const cors = require("cors");
const mongoose = require('./config/database')
const baseURL = "/api";
const PORT = process.env.PORT || 3000;
const app = express();

const jobs = require("./routes/jobRouter");
const users = require("./routes/userRouter")
app.use(express.json());
app.use(`${baseURL}/jobs`,jobs)
app.use(`${baseURL}/users`,users)
app.use(cors())
app.listen(PORT,()=>{
    console.log(`Server Started at PORT ${PORT}`)
})