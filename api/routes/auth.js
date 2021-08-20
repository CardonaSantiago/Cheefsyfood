const { Router } = require('express')
const router =Router();
const mongoose =require('mongoose')
const Usuario = mongoose.model("Usuario")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middlewares/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
//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


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))

router.get('/protected',requireLogin,(req,res)=>{
    res.send("Hola usuario")
})

router.post('/signup',(req,res)=>{
    const {name, lastname, email, password, pic}= req.body
    if(!name || !lastname || !email || !password){
        return res.status(422).json({error: "Porfavor agregue todos los campos"})
    }
    Usuario.findOne({email:email})
    .then((savedUsuario)=>{
        if(savedUsuario){
            return res.status(422).json({msg:"El usuario ya existe con ese email"})
        }
        //encriptado de contraseña con numero de vueltas, entre mas vueltas mas demorado en ejecutar y por ende mas seguro
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            //guardar nuevo usuario
            const user = new Usuario({
                name,
                lastname,
                email,
                password: hashedpassword,
                pic
            })
    
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"santiagocardg@gmail.com",
                    subject:"registro exitoso",
                    html:"<h1>Bienvenido a cheefsy food</h1>"
                })
                
                res.json({msg:"guardado exitosamente"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
        
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const{email, password}= req.body
    if(!email || !password){
        res.status(422).json({error:"Por favor agregue el correo o la contraseña"})
    }
    Usuario.findOne({email:email})
    .then(savedUsuario=>{
        if(!savedUsuario){
            return res.status(422).json({error:"El correo o la contraseña son invalidos"})
        }
        bcrypt.compare(password,savedUsuario.password)
        .then(doMatch=>{
            if (doMatch) {
                //res.json({msg:"Ingreso satisfactorio"})
                const token = jwt.sign({_id:savedUsuario._id},JWT_SECRET)
                const {_id,name,lastname,email,followers,following,pic}=savedUsuario
                res.json({token,user:{_id,name,lastname,email,followers,following,pic}})
            } else {
                return res.status(422).json({error:"El correo o la contraseña son invalidos"})
            }
            
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router