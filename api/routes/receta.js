const { Router } = require('express')
const router =Router();
const mongoose =require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Receta = mongoose.model('Receta')


router.get('/allReceta',requireLogin,(req,res)=>{
    Receta.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(recetas=>{
        res.json({recetas})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/getsubReceta',requireLogin,(req,res)=>{
    //si sigue al posteado
    Receta.find({postedBy:{$in:req.usuario.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(recetas=>{
        res.json({recetas})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createReceta',requireLogin,(req,res)=>{
    const {title,ingredient,prepare,pic}=req.body
    if(!title || !ingredient || !prepare || !pic){
        return res.status(422).json({error:"Por favor llene todos los campos"})
    }
    req.usuario.password=undefined
    const receta = new Receta({
        title,
        ingredient,
        prepare,
        photo:pic,
        postedBy:req.usuario
    })
    receta.save().then(result=>{
        res.json({receta:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/myReceta', requireLogin,(req,res)=>{
    Receta.find({postedBy:req.usuario._id})
    .populate("PostedBy","_id name")
    .populate("PostedBy","_id lastname")
    .then(myreceta=>{
        console.log(myreceta)
        res.json({myreceta})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', requireLogin, (req,res)=>{
    Receta.findByIdAndUpdate(req.body.recetaId,{
        $push:{likes:req.usuario._id}
    },{
        new:true
    }).populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return  res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req,res)=>{
    Receta.findByIdAndUpdate(req.body.recetaId,{
        $pull:{likes:req.usuario._id}
    },{
        new:true
    }).populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return  res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.usuario._id
    }
    Receta.findByIdAndUpdate(req.body.recetaId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletereceta/:recetaId',requireLogin,(req,res)=>{
    Receta.findOne({_id:req.params.recetaId})
    .populate("postedBy","_id")
    .exec((err,receta)=>{

        
        if(err || !receta){
            return res.status(422).json({error:err})
        }
        if(receta.postedBy._id.toString() === req.usuario._id.toString()){
            receta.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router