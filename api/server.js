const express = require('express') ;
const cors = require('cors') ;
const User = require('./Model/User') ;
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken')
const Place  = require('./Model/Place.js') ;
const Booking = require('./Model/Booking.js');
const imageDownloader = require('image-downloader') ;
const cookieParser = require('cookie-parser');
const multer = require('multer')  ;
const fs  = require('fs') ;


const jwtSecret = "jhihgeoghohoeoghh3rfhs" ;
mongoose.connect('mongodb://localhost:27017/user') ;


const app = express() ;
app.use(express.json());
app.use(cookieParser());




app.use('/uploads',express.static(__dirname+'/uploads'))

app.use(cors({
   credentials:true,
   origin:'http://localhost:5173',
})) ;



function getUserDataFromReq(req) {
   return new Promise((resolve, reject) => {
     jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
       if (err) throw err;
       resolve(userData);
     });
   });
 }

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

app.post('/uploads', photosMiddleware.array('photos',100),(req,res)=>{ 
    const uploadedFiles = [] ;

    for(let i =0;i< req.files.length;i++){
        const {path,filename} = req.files[i] ;
        const parts = filename.split('.') ;
        const ext = parts[parts.length -1] ;
        const newPath = path+ '.'+ext ;
        fs.renameSync(path,newPath) ;
    }
    res.json(uploadedFiles) ;
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


app.post('/places',async (req,res)=>{
      const {token} =  req.cookies ;
      
      const{
         title, address,addedPhotos,description
         ,perks, extraInfo, checkIn,checkInfo, checkOut, maxGuests,price
      } = req.body ;

      let userData = await getUserDataFromReq(req) ;
       const placeDoc =   await Place.create({
            owner: userData.id,
           title, address,photos:addedPhotos,description,perks,extraInfo,
           checkInfo,checkIn, checkOut, maxGuests,price
          })
          res.json(placeDoc) ;
      }) 


app.get('/user-places',(req,res)=>{

   const {token} = req.cookies ;
   jwt.verify(token, jwtSecret,{},async (err,userData)=>{
      const {id} = userData;
      res.json(await Place.find({owner:id})) ;
   })
})

app.get('/place/:id',async (req,res) =>{
   let {id} = req.params ;
   res.json(await Place.findById(id)) ;
})

app.put('/places',async(req,res)=>{
   const {token} = req.cookies ;
   const {id,title, address, addedPhotos,description,perks, extraInfo,
   checkIn, checkOut,maxGuests,price} = req.body ;

   

   jwt.verify(token,jwtSecret, {},async (err, userData)=>{
      const placeDoc = await Place.findById(id);    
      if(userData.id === placeDoc.owner.toString()){
         placeDoc.set({
             title, address, photos:addedPhotos, description,perks,extraInfo, checkIn
             ,checkOut, maxGuests,price
         })
         placeDoc.save() ;
         res.json('ok');
      }
   })

})

app.post('/bookings', async (req,res)=>{
     let userData = await getUserDataFromReq(req) ;
     const{
      place,checkIn,checkOut,numberOfGuests,name,phone,price,
     } = req.body ;
     Booking.create({
       place, user:userData.id, checkIn, checkOut, numberOfGuests,name,phone, price,

     }).then((doc) =>{
       
       res.json(doc)
     }).catch((err) =>{
        throw err ;
     })
})

app.get('/bookings', async (req,res)=>{
    let userData = await getUserDataFromReq(req) ;
    res.json(await Booking.find({user:userData.id}).populate('place')) ;
})


app.get('/places', async(req,res)=>{
    res.json(await Place.find())
})
function check_pass(pass,checkpassword){
    if(pass == checkpassword){
       return true ;
    }else{
      return false ;
    }
}


app.listen(4000) ;