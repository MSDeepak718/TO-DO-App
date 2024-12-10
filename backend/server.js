const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


mongoose.connect('mongodb://localhost:27017/').then( ()=> {
    console.log('DB Connected');
});
port = 8000;
app.use(cors());
app.use(express.json());

const todoSchema = mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    }
});
const todoModel = mongoose.model('todo',todoSchema);

app.get('/todo', async (req,res) => {
    try{
        const data = await todoModel.find({});
        res.status(201).send(data);
    } catch(error) {
        res.status(404).json({'message':error.mesage});
    }
});

app.post('/todo', async (req,res)=>{
    const {title,description} = req.body;
    try{
        const data = await new todoModel({
            title,
            description
        });
        data.save();
        res.status(201).send(data);
    } catch(error){
        res.status(404).json({'message':error.message});
    }
});

app.put("/todo/:id", async (req,res) => {
    try{
        const {title,description} = req.body;
        const id = req.params.id;
        const data = await todoModel.findByIdAndUpdate(
            id,
            {title , description},
            {new: true}
        )
        if(!data){
            console.log("Update Failed");
            res.status(404).json({message:'update failed'});
        }
        res.status(201).send(data);
    } catch(error) {
        res.status(500).json({'message':error.message});
    }
});

app.delete('/todos/:id', async (req,res) => {
    try {
        const id = req.params.id;
        const data = await todoModel.findByIdAndDelete(id);
        res.send(data);
    } catch(error) {
        res.json({'message':error.message});
    }
})


app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
});
