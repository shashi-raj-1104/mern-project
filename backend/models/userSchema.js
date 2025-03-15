import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    }, 
    posts:{
        type:Array,
        default:[]
    }, 
    bookmarks:{
        type:Array,
        default:[]
    },
    bio:{
        type: String
    },
    profile_photo:{
        type: String
    },
    cover_photo:{
        type: String
    }
},{timestamps:true});
export const User = mongoose.model("User", userSchema);