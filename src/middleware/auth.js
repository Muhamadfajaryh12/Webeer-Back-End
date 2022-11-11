const jwt = require('jsonwebtoken');
require("dotenv").config();
const auth = (req,res,next) =>{
    const token = req.header('auth')
    if(!token) return res.status (401).send('Perlu Akses')

    try{
        const verfy = jwt.verify(token,process.env.SECRET_KEY)
        req.user = verfy;
        next()
    }
    catch(err){
        res.status(400).send('invalid token')
    }
}
module.exports = auth;