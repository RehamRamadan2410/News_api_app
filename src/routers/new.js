const express = require('express')
const New= require('../models/new')
const router = new express.Router()
const auth = require('../middelware/auth')


// post

router.post('/news',auth,async(req,res)=>{
    try{
        // const task = new Task(req.body)
        // spread operator --> copy of data
        const news = new New({...req.body,owner:req.author._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})

// get all

router.get('/news',auth,async(req,res)=>{
    try{
        const News= await New.find({})
        res.send(News)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// get by id

router.get('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news= await New.findOne({_id,owner:req.author._id})
        if(!news){
            return res.status(404).send('No news are found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// patch 
router.patch('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await New.findOneAndUpdate({_id,owner:req.author._id},req.body,{
            new:true,
            runValidators:true
        })
        if(!news){
            res.status(404).send('No news are found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// delete

router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await New.findOneAndDelete({_id,owner:req.author._id})
        if(!news){
            res.status(404).send('No news are found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

/////////////////////////////////////////////////////////////////////////////

router.get('/authorNews/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news= await New.findOne({_id,owner:req.author._id})
        if(!news){
            return res.status(404).send('No news is found')
        }
        await news.populate('owner')
        res.status(200).send(news.owner)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
////////////////////////////////virtual(relation)/////////////
// get of author News
router.get('/news',auth,async(req,res)=>{
    try{
       await req.author.populate('news')
       res.send(req.authorr.news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})


module.exports = router