const jwt=require('jsonwebtoken')


const isAuthenticate=async(req,res,next)=>{
    try {
        //  console.log("Cookies:", req.cookies)
        const token=req.cookies.token
        // console.log('this the token',token);
        if(!token){
            return res.status(401).json({message:"user not authenticate"})
        }
        const decode=await jwt.verify(token,process.env.SECRET_KEY)
        if (!decode) {
            return res.status(401).json({message:"Invalid token"})
        }
        req.userId = decode.id;
        req.userRole = decode.role;
        next()
    } catch (error) {
                console.error(error);
              return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
}
module.exports={isAuthenticate}