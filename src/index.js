const express = require('express')
const New = require('./models/new')
const app = express()
const port = process.env.PORT ||  3000
const authorRouter = require('./routers/author')
const newRouter = require('./routers/new')
require('./db/mongoose')

app.use(express.json())
app.use(authorRouter)
app.use(newRouter)

///////////////////
// const main = async()=>{
//         const news = await New.findById('62167b3b1c034e166c006baa')
//         await news.populate('owner') //62167b3b1c034e166c006baa
//         console.log(news.owner)
//     }
//     main()
    ///////////






app.listen(port,()=>{
    console.log('Server is running')
})