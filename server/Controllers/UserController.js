import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get User From Database
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherdetails } = user._doc;
      res.status(200).json(otherdetails);
    } else {
      res.status(404).json("NO SUCH USER EXIST");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


//GET ALL USER 


export const getAllUser = async(req,res) =>{
  try {
    let users = await UserModel.find();

    users=users.map((user)=>{
      const {password,...otherDetails} = user._doc;
      return otherDetails
    })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
}
// UPDATE A USER

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, currentUserAdminStatus, password } = req.body;

  if (id === _id ) {
    try {

        if(password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(password,salt)
        }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const token =jwt.sign(
        {username:user.username,id:user._id},
        process.env.JWT_KEY,
        {expiresIn:"1h"}
      )
      res.status(200).json({user,token});
    } catch (error) {
      res.status(500).json(error);
    }
  }else{
    res.status(403).json("ACCESS DENIED! YOU CAN ONLY UPDATE YOR OWN PROFILE ")
  }
};


//DELETE USER 


export const deleteUser = async (req,res) =>{
    const id = req.params.id;
    const {currentUserId, currentUserAdminStatus} = req.body;

    if(currentUserId===id || currentUserAdminStatus){
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("USER DELETED SUCCESSFULLY")
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("ACCESS DENIED! YOU CAN ONLY DELETE YOR OWN PROFILE ")
      }
}

// Follow a User 

// export const  followUser = async (req,res)=>{
//     const id = req.params.id

//     const {_id} = req.body;

//     if(_id===id){
//         res.status(403).json("Action forbidder")
//     }else{
//         try {
//             const followUser = await UserModel.findById(id);
//             const followingUser = await UserModel.findById(_id);


//             if(!followUser.followers.includes(currentUserId)){
//                 await followUser.updateOne({$push: {followers: _id}})
//                 await followingUser.updateOne({$push:{following:id}})
//                 res.status(200).json("USER FOLLOWED!")
//             }
//             else{
//                 res.status(403).json("USER IS ALREADY FOLLOWED BY YOU")
//             }
//         } catch (error) {
//             res.status(500).json(error);
//         }
//     }


// }
// Follow a User
// changed
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  console.log(id, _id)
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
};


// UNFollow a User 

// export const  unfollowUser = async (req,res)=>{
//     const id = req.params.id

//     const {_id} = req.body;

//     if(_id===id){
//         res.status(403).json("Action forbidder")
//     }else{
//         try {
//             const followUser = await UserModel.findById(id);
//             const followingUser = await UserModel.findById(_id);


//             if(followUser.followers.includes(currentUserId)){
//                 await followUser.updateOne({$pull: {followers: _id}})
//                 await followingUser.updateOne({$pull:{following:id}})
//                 res.status(200).json("USER UNFOLLOWED!")
//             }
//             else{
//                 res.status(403).json("USER IS NOT FOLLOWED BY YOU")
//             }
//         } catch (error) {
//             res.status(500).json(error);
//         }
//     }


// }
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const unFollowUser = await UserModel.findById(id)
      const unFollowingUser = await UserModel.findById(_id)


      if (unFollowUser.followers.includes(_id))
      {
        await unFollowUser.updateOne({$pull : {followers: _id}})
        await unFollowingUser.updateOne({$pull : {following: id}})
        res.status(200).json("Unfollowed Successfully!")
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};


