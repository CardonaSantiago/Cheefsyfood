const { Router } = require('express')
const router =Router();
const mongoose =require('mongoose');
const requireLogin = require('../middlewares/requireLogin')
const Receta = mongoose.model('Receta')
const Usuario = mongoose.model('Usuario')


router.get('/usuario/:id',requireLogin,(req,res)=>{
    Usuario.findOne({_id:req.params.id})
    .select("-password")
    .then(usuario=>{
        Receta.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,recetas)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({usuario,recetas})
        })
    }).catch(err=>{
        return res.status(404).json({error:"Usuario no encontrado"})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    Usuario.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.usuario._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        Usuario.findByIdAndUpdate(req.usuario._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/unfolloW',requireLogin,(req,res)=>{
    Usuario.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.usuario._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        Usuario.findByIdAndUpdate(req.usuario._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/updatepic',requireLogin,(req,res)=>{
    Usuario.findByIdAndUpdate(req.usuario._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
            if (err) {
                return res.status(422).json({error:"no se ha podido actualizar la imagen"})
            }
            res.json(result)
        })
})

router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    Usurario.find({email:{$regex:userPattern}})
    .then(usuario=>{
        res.json({usuario})
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router