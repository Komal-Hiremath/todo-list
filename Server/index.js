const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Model/Todo');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test');

// Get all todos
app.get('/get', (req, res) => {
  TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Mark a task as done
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { task, done, priority, dueDate } = req.body;
  TodoModel.findByIdAndUpdate(
    id,
    { task, done, priority, dueDate },
    { new: true }
  )
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Delete a task
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndDelete({ _id: id })
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Add a new task
app.post('/add', (req, res) => {
  const { task, priority, dueDate } = req.body;
  TodoModel.create({
    task,
    priority,
    dueDate: dueDate || null  
  })
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Start server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
