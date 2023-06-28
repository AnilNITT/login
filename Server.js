const express = require("express")
const app = express()
const http =  require("http")
const mongoose = require("mongoose")
const cors = require("cors")
const User = require("./Model/user")
const user = require("./Model/user")
const upload = require("./multer/multer")

//mogoose connect
mongoose.connect('mongodb+srv://Anil:abcd@cluster0.btr1boo.mongodb.net/?retryWrites=true&w=majority',
  {useNewUrlParser: true,
    useUnifiedTopology: true}
).then((data)=>{
    console.log(`database connected ${data.connection.host}`);
}).catch((err)=>{
    console.log("mogodb err", err);
})


// apply middleware
app.use(express.json())


//create server 
 const server = new http.createServer(app)

// apply middileware
app.use(cors())
app.use(express.json())
// make image folder to public
app.use("/uploads",express.static("uploads"))


app.get("/",(req,res)=>{
    // res.send("server connect");
    res.json({massage: "succesfull"})
})



// login api raw data
app.post("/login",async(req,res)=>{
  console.log(req.body);
  const {email , password} = req.body
   const user = await User.findOne({email:email})
   if(!user){
    res.send({
      status:"fail",
      message : "user not found"
    } )
   }else{
    if(user.password === password){
      res.send({
        status:true,
        message : "succesfull",
        data: user
      } )
    }else{
      res.send({
        status:"fail",
        message : "passwprd incorrect"
      } )
    }

   }
}) 


// register  user api  form  fdata
app.post("/register",upload.single("image") ,async(req , res)=>{

  const{  fname,lname, email, password, country,gender} = req.body
//  const user = await User.create(req.body)
 const user = await User.findOne({email : email})
 
if(user){
  res.send({
    status:"fail",
    message : "user already egisterd"
  } )
}else{


  const data = { 
      fname:fname,
      lname:lname,
      email:email,
      image:req.file ? req.file.filename : "",
      password:password,
      country:country,
      gender:gender

  }
  const user =await User.create(data)
  await user.save();
  res.json({
    message: "succesfull",
    status:true,
    data:user
  })
}
})



//get all SINGLE user api 
 app.get("/get-single-user/:id",async(req,res)=>{
  console.log(req.params.id);
 const user = await User.findById(req.params.id)
    if(user){
      res.send({
        status:true,
        message : "succesfull",
        data: user
      } )
    }else{
      res.send({
        status:"fail",
        message : "user not found"
      } )
    }

 })


//get all user api 
app.get("/get-all-user",async(req,res)=>{
  // get al user
  //const user = await User.find({})

  // get all user and search
  const user = await User.find(req.query)
  if(user){
    res.send({
      status:true,
      message : "succesfull",
      data: user
    } )
  }else{
    res.send({
      status:"fail",
      message : "user not found"
    } )
  }
})


// delete user 
app.delete("/delete-user",async(req,res)=>{
  const {userid} = req.query
  const  user = await User.findById(userid)
  if(user){
    const data = await User.findByIdAndDelete(userid)
     res.send({
      status :true,
      data : data,
      message : "user delete successfully"
     })
  }else{
    res.send({
      status:"fail",
      message : "user not found"
    } )
    return;
  }
})

app.patch("/update-user", async(req,res)=>{
  const  {userid,fname ,lname,country,gender} = req.body
    const user = await User.findById(userid) 
    if(user){

      const userdata = {
        fname : fname,
        lname : lname,
        country : country,
        gender : gender
      }

      const data = await User.findByIdAndUpdate({_id:userid},{$set : userdata},{new : true})
         res.send({
          status : true,
          data : data,
          message : "user update successfully"
         })
    }else{
      res.send({
        status : "fail",
        message :"user not found"
         })
    }

  
})


 // sever connenct
 const port = 5000
 server.listen(port,(req,res)=>{
    console.log(`server is running on port ${port}`)
 })
