const User = require("../module/user.module");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserController = {
    async signup(req, res){
        const {name, email, password, mobile} = req.body;
        if(!name && !email && !password && !mobile){
            return res.status(400).json({"error":"Requied Filed is Missing"})
        }

        try{
            const emailCheck = await User.findOne({email});
            if(emailCheck){
                return res.status(400).json({"message":"Email is Already existing"})
            }

            const mobileCheck = await User.findOne({mobile});
            if(mobileCheck){
                return res.status(400).json({"message":"Mobile is Already existing"})
            }

            const token = jwt.sign({
                name: name,
                email: email
            }, "JWT_SECRET");

            const user = await User.create({
                name,
                email,
                password: password,
                mobile,
                token
            })
            
            return res.status(201).json({
                token
            })
        }
        catch(error){
            console.log(error);
            
            res.status(500).json({"message": "Server error", "error": error.message})
        }
    },

    async signin(req, res){
        const {email, password} = req.body;
        if(!email & !password){
            res.status(400).json({"message":"Requied field is missing"})
        }
        
        try{
            const user = await User.findOne({email});
            if(!user){
                return res.status(401).json({"message":"Invalid Credentials"})
            }
            let passwordMatch = await bcrypt.compare(password, user.password);  
            if(!passwordMatch){
                return res.status(401).json({"message":"invaild password"});
            }

            let filterData = {
                name: user.name,
                email: user.email,
                mobile: user.mobile,
            }

            let token = jwt.sign({filterData},"JWT_SECRET",{expiresIn: "7d"})
            return res.status(201).json({data:{token}})
            
        }catch(error){
            console.log(error);
            
        }

    }
}

module.exports = UserController