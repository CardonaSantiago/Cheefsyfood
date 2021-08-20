const mongoose =require('mongoose')
const { Schema, model } = require("mongoose");
const {ObjectId} = mongoose.Schema.Types


const UsuarioSchema = Schema({
    name: {type:String,required:true},
    lastname:{type:String,required:true},
    email: {type:String,required:true, unique:true},
    password: {type:String, required:true},
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dlgsp6q75/image/upload/v1624821422/login-icon_wktn8o.png"},
    followers: [{ type:ObjectId, ref:"Usuario"}],
    following: [{type:ObjectId, ref:"Usuario"}]
});

model('Usuario', UsuarioSchema)