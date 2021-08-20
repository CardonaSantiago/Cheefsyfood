//Dependencias
//const express = require('express');
import express from 'express';
import cors from 'cors';

// Crear el servidor
const app =  express();
import mongoose from 'mongoose';
const {connect, connection} = mongoose


const MONGOURI = import('../api/config/dev')
const PORT = process.env.PORT || 5000

// conectar con mongodb
connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false,
    
})
connection.on('connected',()=>{
    console.log('conectado con mongo')
})
connection.on('error',(err)=>{
    console.log('err conectando con mongo', err)
})


//cors
app.use(cors())

// exportacion de modelos
require('./models/Usuario')
require('./models/Receta')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/receta'))
app.use(require('./routes/usuario'))

if (process.env.NODE_ENV=="production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
//iniciar
app.listen(PORT, ()=>{
    console.log("servidor corriendo en puerto: ", PORT)
})

