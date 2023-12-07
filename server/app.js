const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const CodeBlock = require('./Models/Codeblock');
const {Server} = require('socket.io');
const app = express();
const cors = require('cors');
require('.env').config();



app.use(cors());
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the MongoDB database');
   
   });


const server = http.createServer(app); 
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000"
    }
});



const mentors = [];


io.on('connection',(socket)=>{
 console.log(`User Connected : ${socket.id}`);
  
 socket.on('code-update',handelCodeUpdate)
  async function handelCodeUpdate(data){
    try{
      let doc = await CodeBlock.findOne({id:data.id});
     console.log(`to update is: ${doc}`); 
     update = {code: data.code};
     await doc.updateOne(update);
     const updatedDoc = await CodeBlock.findOne({ id: data.id});
     console.log(` updated doc  is: ${updatedDoc}`)
    }
   catch(error){
     console.log("Could not update");
   }
   io.to(data.id).emit('code-received',(data.code));
   }

  //console.log(}data);
  


  socket.on('enter-page', handeEnterPage);
    function handeEnterPage(data){
      const userID = socket.id;
      var isFirstUser
      if(mentors[data.id] == null ){
        isFirstUser = true;
        mentors[data.id] = userID;
        
      }
      else{
       isFirstUser = false;
       
      } 
      socket.join(data.id); //joining the room
      console.log("User joined room " + data.id);
      io.emit('enter-page',isFirstUser);
     
   console.log(`is first user? : ${isFirstUser}`);
   socket.off('enter-page' ,handeEnterPage);
   

  }

  
 })
 
  async function getCodeBlockByID(_id){
 try{
  const codeblock = await CodeBlock.findOne({id:_id});
  if(codeblock){
    console.log(codeblock);
    return codeblock;
  }
  else{
    console.log("could not find codeblock");
  }

 }catch(error){
  console.log('Error retrieving code block;' , error);
 }
 }

app.get('/lobby', async (req, res) => {
  console.log("reached Lobby");
  try {
    const codeblocks = await CodeBlock.find();
    console.log(codeblocks);
    res.json(codeblocks); //transfering to json
  } catch (error) {
    console.error('Error fetching code blocks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/codeblock/:id', async (req, res) => {
  try {
    const  _id  = req.params.id;
    const codeblock = await getCodeBlockByID(_id);
    res.json(codeblock); 
  } catch (error) {
    console.error('Error fetching code blocks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


server.listen(5000,()=>{
    console.log("Server is running");
}
 )
 