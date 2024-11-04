const express  = require("express")
const router = express.Router()
const User = require("../models/User");


  router.post("/", async(req, res)=>{
    console.log(req.body)

    try {
      const user = await User.findById(req.body.id)

      let userBalance = user.balance
      if(!user){
          return res.json({msg:"user does not exist"})
        }
      return res.json({msg:userBalance})
    } catch (err) {
      console.log(err)     
    }
  })



  module.exports = router;
