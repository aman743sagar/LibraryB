require('dotenv').config();  
let express = require('express');
let mongoose = require('mongoose');
let cors= require('cors')
const cookieParser = require('cookie-parser');

let UserRoute=require('./Routes/userRoutes.js')
let adminRoutes= require('./Routes/adminRoutes.js')
let BookRoutes=require('./Routes/bookroutes.js')
let Payment=require('./Routes/paymentroute.js')
let Subscripation=require('./Routes/subscripationRoute.js')






const MONGO_URI = process.env.MONGO_URI
let PORT=9000


const app = express();

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://jazzy-cendol-91837d.netlify.app"
//   ],
//   credentials: true,
// }));
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://jazzy-cendol-91837d.netlify.app",
    "https://lucky-wisp-5a82c8.netlify.app",
    "https://marvelous-crisp-ae4fd4.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json())
app.use(cookieParser());

app.use('/user',UserRoute)
app.use('/admin',adminRoutes)
app.use('/books',BookRoutes)
app.use('/payments', Payment)
app.use('/subscription',Subscripation)


const start=async()=>{
    let connection=await mongoose.connect(MONGO_URI)
    console.log("Mongo DB is connected");
     require("./utils/subscriptionCron");
    app.listen(PORT,()=>{
        console.log("Server is listen at PORT 9000");
    })
}
start()