const express  = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");


router.get("/", async(req, res)=>{
    try {
      const user = await User.findOne({email: req.body.email})
    } catch (err) {
      console.log(err)     
    }
  })
  

router.post("/",[check("name", "Name is required").not().isEmpty(),check("email", "Please enter a valid email").isEmail(),check("password","please  password should have at least 5 characters").isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.save();
      // res.json({msg:"User successfully registered"})
      
      const payload = {
        user: {
          id: user.id,
        },
      };
      console.log(config.jwtSecret)


      jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 * 24 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
          console.log(token)

        }
      );

    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
