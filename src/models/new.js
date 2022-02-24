const mongoose = require('mongoose')

const New = mongoose.model('New',{
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Author'
    }
})
module.exports =New