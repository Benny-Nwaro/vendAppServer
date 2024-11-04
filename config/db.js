const  mongoose = require("mongoose")
const db = require("./keys")
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const  connectDb = async()=>{
    try {
        await mongoose.connect(db.mongoDbUri, clientOptions)
        console.log("Successfully connected to database")
    } catch (err) {
        console.log("Database connection failed")
        process.exit(1)
        
    }
}
module.exports = connectDb;