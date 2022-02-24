const express = require('express')
const User = require('../models/author')
const router = new express.Router()
const auth = require('../middelware/auth')
const Author = require('../models/author')

const multer = require('multer')


router.post('/authors',async (req,res)=>{



    try{
       const author = new Author(req.body) 
       await author.save()
        const token = await author.generateToken()
        res.status(200).send({author,token})
    }
   catch(e){
       res.status(400).send(e)
   }
})

router.post('/login',async(req,res)=>{
try{
    const author = await Author.findByCredentials(req.body.email,req.body.password)
    const token = await author.generateToken()
    res.status(200).send({author,token})
}
catch(e){
    res.status(400).send(e.message)
}
})

////////////////////////////////////////////////////////////////////////////

// profile

router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.author)
})

///////////////////////////////////////updata///////////////////////////////////////
router.patch('/profile',auth,async(req,res)=>{
    
        const updates = Object.keys(req.body)
        
    //    const author = await Author.findById(req.params.id)
       updates.forEach((el)=>(req.author[el]=req.body[el]))
       await req.author.save()
        res.status(200).send(req.author)
    
  
    })
////////////////////////////////delete////////////////
router.delete('/profile',auth,async(req,res)=>{
    
    await req.author.save()
    res.send("Delete profile")
})

//////////////////////////////////////////////////////////////////////////////

// logout 
router.delete('/logout',auth,async(req,res)=>{
    try{
        
        req.author.tokens = req.author.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.author.save()
        res.send('Logout Successfully')
    }
    catch(e){
        res.status(500).send(e)
    }
})

// logoutall 
router.delete('/logoutall',auth,async(req,res)=>{
    try{
        req.author.tokens = []
        await req.author.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }

})

///////////////////////////////////////////////////////////////////////////////

// upload avatar image for user
const uploads = multer({
    // 1MG
    limits:{
        fileSize:1000000  // byte
    },
    fileFilter(req,file,cb){
        // flowerfte7rdsg6s.jpg  --> /\. $/
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('Please upload image'))
        }
        cb(null,true)
    }
}) 

router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
try{
    req.author.avatar = req.file.buffer
    await req.author.save()
    res.send()
}
catch(e){
    res.status(500).send(e)
}
})


module.exports = router