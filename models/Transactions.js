const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TransactionSchema = new mongoose.Schema({
      senderId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      receiverId: {
        type: Schema.Types.ObjectId,
        required: true,
      },

      transactionType: {
        type: String,
        required: true,
      },


  date: {
    type: Date,
    default: Date.now(),
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
