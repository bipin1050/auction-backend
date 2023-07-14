const jwt = require('jsonwebtoken');
require("dotenv").config();
// const { verifyToken } = require('../controller/userController');


module.exports.verifyToken = async function verifyToken (req, res, next) {
    try{
        let token = req.header("Authorization");
        if(!token){
            return res.status(403).send("Access Denied");
        }
        if (token.startsWith("Bearer ")){
            token = token.substring(7).trimStart();
        }
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    }catch(err){
        res.status(500).json({error : err.message})
    }
}