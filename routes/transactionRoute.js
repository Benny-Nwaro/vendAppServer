const express  = require("express")
const router = express.Router()
const User = require("../models/User");
const Transactions = require("../models/Transactions")



async function updateOneUser(filter, updateData) {
    try {
      const result = await User.updateOne(filter, updateData);
      console.log("Update result:", result);
      return result;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  router.get("/", async(req, res)=>{
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

router.get("/:id", async(req, res)=>{
    try {
      const principalId = '6720f2c35fb7039632c2e5de'
      const user = await User.findById(req.params.id)
      const principal = await User.findById(principalId)
      let userTransaction = await Transactions.findById(req.params.id)

      if(user){
        if(user.tokenClaimed){
            return res.json({msg:"token already claimed"})
        }
        let transactionDetail = {}
        principal.balance -= 10000
        user.balance += 10000
        updateOneUser({ email: principal.email }, { balance: principal.balance });
        updateOneUser({ email: user.email }, { balance: user.balance });
        updateOneUser({ email: user.email }, {tokenClaimed:true});

        transactionDetail.senderId = user.id
        transactionDetail.receiverId = principal.id
        transactionDetail.transactionType = "credited token"
        userTransaction = new Transactions(transactionDetail)
        await userTransaction.save()
        res.json({msg:"Token claimed", userDetails: user })
        // console.log(userTransaction)

      }   
    } catch (err) {
      console.log(err)     
    }
  })

  router.post("/", async(req, res)=>{
    try {
        const senderId = req.body.senderId
        const recipientId = req.body.receiverId
        const transferAmount = req.body.transferAmount
        let senderAccount = await User.findById(senderId) 
        let reciverAccount = await User.findById(recipientId)
        if(!senderAccount){
            return res.json({msg:"Sender does not exist"})
        }
        if(!reciverAccount){
            return res.json({msg:"Receiver does not exist"})
        }
        if(senderAccount.balance < transferAmount){
            return res.json({msg:"Insufficient funds"})      
        }
        senderAccount.balance -= transferAmount
        reciverAccount.balance += transferAmount
        updateOneUser({ email: senderAccount.email }, { balance: senderAccount.balance });
        updateOneUser({ email: reciverAccount.email }, { balance: reciverAccount.balance });

        let transactionDetail = {}
        transactionDetail.senderId = senderAccount.id
        transactionDetail.receiverId = reciverAccount.id
        transactionDetail.transactionType = "token exchange"
        let userTransaction = new Transactions(transactionDetail)
        await userTransaction.save()
        res.json({msg:"Token transfer successful"})
        
    } catch (error) {
        res.json({msg: error})
        
    }

  })

  module.exports = router;
