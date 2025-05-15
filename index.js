const express = require('express');
const mongoose = require('mongoose');
const Person=require('./models/person');
const cors=require('cors');

require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected'))
    .catch(err => {
        console.error('DB connection error:', err);
        process.exit(1);
    });

app.get('/person', async (req, res) => {
    try {
        const personList = await Person.find();
        res.json(personList);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch people',err });
    }


});

app.post('/person', async (req, res) => {
    const { Name, Age, Gender, MobileNumber } = req.body;
    try {
        if (!Name || !Age || !Gender || !MobileNumber) {
            return res.status(400).json({ error: 'Fields are missing' });
        }
        const newPerson = new Person({Name, Age, Gender, MobileNumber});
        await newPerson.save();
        res.status(201).json({ message: 'Success, New user added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error:',err });
    }
});

app.put('/person/:id', async (req, res) => {
    try {
        const userid=req.params.id;
        if(!userid){
            return res.status(400).json({error:'user id missing'});
        }
        const { Name, Age, Gender, MobileNumber } = req.body;        
        const search=await Person.findById(userid);
        if(!search){
            return res.status(400).json({error:'User not found'});
        }
        if (!Name || !Age || !Gender || !MobileNumber) {
            return res.status(400).json({ error: 'Fields are missing' });
        }
        const updated = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'User updated successfully', updated });
    }
    catch(err){
        res.status(500).json({error:'Server Error:',err});
    }
});

app.delete('/person/:id', async (req, res) => {
    try {
        const userid = req.params.id;
        if (!userid) {
            return res.status(400).json({ error: 'User ID missing' });
        }

        const search = await Person.findById(userid);
        if (!search) {
            return res.status(404).json({ error: 'User not found' });
        }

        await Person.findByIdAndDelete(userid);
        res.status(200).json({ message: 'Person deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', err });
    }
});
app.get('/person/:id', async (req, res) => {
    try {
      const person = await Person.findById(req.params.id);
      if (!person) {
        return res.status(404).json({ error: 'Person not found' });
      }
      res.json(person);
    } catch (err) {
      res.status(500).json({ error: 'Server error', err });
    }
  });
  
app.listen(3000,()=>{
    console.log('Server listening to 3000');
})