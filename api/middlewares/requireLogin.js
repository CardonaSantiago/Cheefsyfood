const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose =require('mongoose')
const Usuario = mongoose.model("Usuario")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //autorization === Bearer ewefwegwrherhe
    if(!authorization){
        return res.status(401).json({error:"debes estar logueado"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"debes estar logeado"})
        }
        const {_id} = payload
        Usuario.findById(_id).then(datousuario=>{
            req.usuario = datousuario
            next()
        })
        
    })
}