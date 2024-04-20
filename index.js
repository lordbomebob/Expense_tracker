const express = require("express");
const mongoose = require(`mongoose`)
const app=express()
const port=4000
require(`dotenv`).config()
const UserRoutes= require('./routes/User')
const ExpenseRoute= require(`./routes/Expense`)

const path= require(`path`)
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log(`connected to database`)
}).catch((error)=>{
    console.error(`error connecting to database: ${error}`)
})
//app.get(`/`,(req,res)=>{
//    res.send(`blog app endpoint`)
//})
app.use(express.static(path.join(__dirname,`frontend`)))
app.use(`/api/v1/users`,UserRoutes)
app.use(`/api/v1/users/expense`,ExpenseRoute)

app.listen(port,()=>{
    console.log(`server running at port ${port}`)
})