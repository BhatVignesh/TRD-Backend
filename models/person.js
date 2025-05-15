const mongoose=require('mongoose');

const PersonSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Age:{
        type:Number,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    MobileNumber:{
        type:String,
        required:true
    }

});

module.exports=mongoose.model('Person',PersonSchema,'Person');