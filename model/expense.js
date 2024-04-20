const { Double } = require('bson')
const mongoose = require('mongoose')
const { double } = require('webidl-conversions')

const ExpenseSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        
    },
    date:{
        type: Date,
        require:true
    },
    cost:{
        type: Number,
        require:true
    },
    type:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        require:true
    }
    
},
{
    timestamps: true
})

const ExpenseModel = mongoose.model("Expense", ExpenseSchema)

module.exports= ExpenseModel