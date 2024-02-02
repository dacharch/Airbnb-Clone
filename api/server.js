const express = require('express') ;
const cors = require('cors') ;
const User = require('./Model/User') ;
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken')
const imageDownloader = require('image-downloader') ;
const cookieParser = require('cookie-parser');
const multer = require('multer')  ;
const fs  = require('fs') ;




const app = express() ;
app.use(express.json());
app.use(cookieParser());


app.use('/uploads',express.static(__dirname+'/uploads'))


app.use(cors({
   credentials:true,
   origin:'http://localhost:5173',
})) ;


const jwtSecret = "jhihgeoghohoeoghh3rfhs" ;
mongoose.connect('mongodb://localhost:27017/user') ;



app.post('/register',async(req,res)=>{
   const{name,email,password} = req.body ;
   const user =  await User.create({
      name,
      email,
      password,
   })
   res.send(user) ;
})

app.post('/login',async(req,res)=>{
    const{email,password} = req.body ;
     const UserDoc= await User.findOne({email})
     if(UserDoc){
       let passwordOk = check_pass(password,UserDoc.password) ;
       if(passwordOk){
           jwt.sign({email:UserDoc.email,
              id:UserDoc._id,
              name:UserDoc.name},
              jwtSecret,{},(err,token)=>{
             if(err)
               throw err ;
               res.cookie('token',token).json(UserDoc) ;
           })
         
       }else{
          res.json("Password Not Okay") ;
       }
     }else{
       res.json("Not Found")
     }
})

app.post('/logout',(req,res)=>{
   res.cookie('token','').json(true) ;
   res.redirect('http://localhost:5173/login') ;
})
app.post('/uploadImageLink',async (req,res)=>{
    const{link} = req.body ;
    const newName = 'photo'+Date.now() + '.jpg' ;

    await  imageDownloader.image({
       url:link ,
       dest: __dirname+'/Uploads/'+newName ,
    })
    
    res.json(newName);


})

const photosMiddleware = multer({dest:'uploads/'}) ;
app.post('/uploads',photosMiddleware.array('photos',100),(req,res)=>{ 
    const uploadedFiles = [] ;

    for(let i =0;i< req.files.length;i++){
        const {path,filename} = req.files[i] ;
        const parts = originalname.split('.') ;
        const ext = parts[parts.length -1] ;
        const newPath = path+ '.'+ext ;
        fs.rennameSync(path,newPath) ;
    }


     res.json(req.files) ;

}) ;
app.get('/profile',(req,res)=>{
    const {token} = req.cookies ;
    if(token){
      jwt.verify(token,jwtSecret,{},async (err,userData)=>{
         if(err) 
           throw err  ;
         const {name,email,_id} = await User.findById(userData.id) 

         res.json({name,email,_id}) ; 
      })
    }else{
       res.json(null) ;
    }
  
    
})

function check_pass(pass,checkpassword){
    if(pass == checkpassword){
       return true ;
    }else{
      return false ;
    }
}

console.log("hrry")

app.listen(4000) ;