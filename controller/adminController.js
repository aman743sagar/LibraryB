const User = require('../Models/user');


const getallUser=async(req,res)=>{
    try {
        const Users= await User.find().select("-password")
        // console.log(Users);
        res.json(Users)
    } catch (error) {
         res.status(500).json({ message: "User  find failed",error:error.message });
    }
}

const getUserById=async (req,res)=>{
    try {
        const Users=await User.findById(req.params.id).select("-password").populate("borrowBook.bookId", "title author isbn").populate("subscription")
        // console.log(Users);
        res.json(Users)
    } catch (error) {
        console.log(error);
         res.status(500).json({ message: "User find  failed",error:error.message });
    }
}

const deleteUser=async(req,res)=>{
    try {
        const deletedUser= await User.findByIdAndDelete(req.params.id)
        if(!deletedUser)   return res.status(404).json({ message: "User not found" });
        console.log(deletedUser);
         res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "User deletation failed",error:error.message });
    }

}

module.exports={getallUser, getUserById,deleteUser}