let express = require('express');
let mongoose = require('mongoose');
let dotenv =require('dotenv')
let cors= require('cors')
const cookieParser = require('cookie-parser');

let UserRoute=require('./Routes/userRoutes.js')
let adminRoutes= require('./Routes/adminRoutes.js')
let BookRoutes=require('./Routes/bookroutes.js')







dotenv.config()
const MONGO_URI = process.env.MONGO_URI 
let PORT=9000


const app = express();

app.use(cors({
  origin: [
    // "http://localhost:5173",
    "https://serene-salamander-812255.netlify.app"
  ],
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser());

app.use('/user',UserRoute)
app.use('/admin',adminRoutes)
app.use('/books',BookRoutes)



const start=async()=>{
    let connection=await mongoose.connect(MONGO_URI)
    console.log("Mongo DB is connected");
    app.listen(PORT,()=>{
        console.log("Server is listen at PORT 9000");
    })
}
start()