const ExpenseModel= require(`../model/expense`)
const jwt= require(`jsonwebtoken`)
const userModel = require(`../model/user`)
const { error } = require("console")
const GetAllExpense= async (req,res)=>{
    
    
    try{
        const expense = await ExpenseModel.find()
        return res.status(200).json({
            message: `found the expenses`,
            data: expense
        })
    }catch(error){
        return res.status(500).json({
            message: `error fetching expenses`,
            error
        })
    }
}

const CreateExpense= async (req,res)=>{
    const allHeader= req.headers
    console.log(allHeader)
    if(!allHeader.authorization){
        return res.status(401).json({
            message: `pls provide token`
        })
    }
    const token= allHeader.authorization

    const decodedToken = jwt.decode(token,{complete:true})
    
    const userID = decodedToken.payload.id

    const userExist = await userModel.findById(userID)
    if (!userExist){
        return res.status(401).json({
            message: `you are not authorized to create expense`
        })
    }

    const expenseBody = req.body

    const newExpense = new ExpenseModel({
        user: userID,
        title: expenseBody.title,
        description: expenseBody.description,
        date: expenseBody.date,
        cost: expenseBody.cost,
        type: expenseBody.type
    })

    const savedExpense = await newExpense.save()

    return res.status(200).json({
        message:"Expense created ",
        data: savedExpense
    })
}

const DeleteExpense= async (req,res)=>{
    const allHeader= req.headers
    if(!allHeader.authorization){
        return res.status(401).json({
            message: `pls provide token`
        })
    }
    const token= allHeader.authorization

    const decodedToken = jwt.decode(token,{complete:true})
    
    const userID = decodedToken.payload.id

    const userExist = await userModel.findById(userID)
    if (!userExist){
        return res.status(401).json({
            message: `you are not authorized to delete expense`
        })
    }
    
    const expenseBody = req.body
    const removeExpense = new ExpenseModel({
        _id:expenseBody._id
    })
    const deleteExpense = await removeExpense.deleteOne()
    return res.status(200).json({
        message:"Expense deleted ",
        data: deleteExpense
    })
}


module.exports={
    GetAllExpense,
    CreateExpense,
    DeleteExpense
}