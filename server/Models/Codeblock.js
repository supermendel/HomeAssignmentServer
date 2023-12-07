const mongoose = require('mongoose');   

const codeSchema = new mongoose.Schema({  
    id:Number,
    title:String,
    code:String,
})

const CodeBlock = mongoose.model("CodeBlock",codeSchema,"CodeBlocks");
module.exports =CodeBlock;