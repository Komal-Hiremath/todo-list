import React, { useState } from 'react';
import axios from 'axios';

function Create({ addTodo }) {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleAdd = () => {
    if (!task.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    axios.post('http://localhost:3001/add', {
      task,
      priority,
      dueDate
    }).then((res) => {
      addTodo(res.data);  // add new task to state without reload
      setTask('');
      setPriority('Medium');
      setDueDate('');
    }).catch(err => console.error(err));
  };

  return (
    <div className="create_form">
      <input
        type="text"
        placeholder="Enter Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="button" onClick={handleAdd}>Add</button>
    </div>
  );
}

export default Create;
