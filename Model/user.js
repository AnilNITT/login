const mogoose = require("mongoose")

const userSchema =new mogoose.Schema({

    fname : String,
    
    lname : {
        type : String,
    },
    email : {
        type : String,
    },
    password : {
        type : String,
    },
    image : {
        type : String,
    },
    country : {
         type : String,
    },
    gender : {
        type : String ,
    }
    
},
{
  timestamps : true,
}
)

module.exports = mogoose.model("User", userSchema)