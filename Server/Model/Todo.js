module.exports = (connection) => {
  const mongoose = require('mongoose');

  const TodoSchema = new mongoose.Schema({
    task: String,
    done: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    dueDate: {
      type: Date,
      default: null
    }
  });

  return connection.model("Todo", TodoSchema);
};
