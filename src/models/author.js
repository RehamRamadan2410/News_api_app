const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const authorScehma = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true  
    },
    email:{
        type:String,
        unique:true, // duplicate email
        required:true,
        trim:true,
        lowercase:true, // 'AMR@GMAIL.COM'  --> 'amr@gmail.com'
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:30,
        validate(value){
            if(value<0){
                throw new Error('Age must be postive number')
                
            }
        }
    },
    phone:{
        type:String,
        require:true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
             throw new Error('Phone is invalid');
            }
           }
    },
    password:{
        type:String,
        required:true,
        trim:true, 
        minLength:6,
        validate(value){
            let reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!reg.test(value)){
                throw new Error('Password must include uppercase, lowercase,special characer & number')
            }
        }
    },

    address:{type:String,
                trim:true},
    
    
               
                tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }
})

/////////////////////////////////////////////////////////////////////////////

authorScehma.virtual('news',{
    ref:'New',  
    localField:'_id',
    foreignField:'owner'  // students
    })


    //////////////////////////////////////////////////////////////////////////////
    // / middelware

    authorScehma.pre('save',async function(){
        // this --> document 
        const author = this
        
        if(author.isModified('password'))
    {    author.password = await bcrypt.hash(author.password,8)}
    })
    
// login

authorScehma.statics.findByCredentials = async (email,password) =>{
    const author = await Author.findOne({email})
    
    if(!author){
        throw new Error('Unable to login..check email or password')
    }
// false 
    const isMatch = await bcrypt.compare(password,author.password)
    // console.log(isMatch)
    if(!isMatch){
        throw new Error('Unable to login..check email or password')
    }
    return author

}

///////////////////////////////////////////////////////////////////////////

authorScehma.methods.generateToken = async function() {
    // author.tokens = []
    const author = this
    const token = jwt.sign({_id:author._id.toString()},'node-course')

    author.tokens = author.tokens.concat(token)
    await author.save()
    
    return token
}

const Author = mongoose.model('Author',authorScehma)
module.exports = Author

