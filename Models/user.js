const mongoose= require('mongoose')


const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "admin"
    },
    borrowBook:[
        {
            bookId:{
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "Book"
            },
             borrowDate: {
             type: Date,
             default: Date.now
            },
            returnDate: {
             type: Date
            }
        }
    ]
},{timestamps:true})



const User=mongoose.model("User", userSchema)
module.exports=User