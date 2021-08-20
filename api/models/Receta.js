const mongoose =require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const { Schema, model } = require("mongoose");


const RecetaSchema = Schema({
    title: {type:String,required:true},
    ingredient:{type:String,required:true},
    prepare:{type:String, required: true},
    photo: {type:String, required: true},
    likes: [{type: ObjectId, ref: "Usuario"}],
    comments: [{text: String, postedBy:{type:ObjectId, ref: "Usuario"}}],
    postedBy: {type:ObjectId, ref: "Usuario"},
},{timestamps:true});

model('Receta', RecetaSchema)