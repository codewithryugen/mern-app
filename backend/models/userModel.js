import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

const {Schema} = mongoose;
const userSchema = Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
},{
    timestamps:true
});


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password,salt);

});

userSchema.methods.matchPasswords = async function (pass){
    return await bcryptjs.compare(pass,this.password);
}

const User = mongoose.model('User',userSchema);
export default User;