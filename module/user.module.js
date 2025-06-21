const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true 
    },
    password:{
        type: String,
        required: true,
    },
    mobile:{
        type: Number,
        required: true
    },
    token:{
        type: String,
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now
    },
    updateAt:{
        type: Date,
        default: Date.now
    }
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next()
});

userSchema.method.comparePassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('users', userSchema);

module.exports = User