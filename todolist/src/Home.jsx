import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsFillTrashFill, BsFillCheckCircleFill, BsCircleFill, BsPencilSquare } from 'react-icons/bs';

function Home() {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:3001/get')
      .then(result => setTodos(result.data))
      .catch(err => console.log(err));
  };

  const addTodo = (newTodo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };
  const toggleDone = (id, done) => {
    axios.put(`http://localhost:3001/update/${id}`, { done: !done })
      .then(() => fetchTodos())
      .catch(err => console.log(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => fetchTodos())
      .catch(err => console.log(err));
  };

  const handleEditClick = (todo) => {
    setEditId(todo._id);
    setEditTask(todo.task);
    setEditPriority(todo.priority || 'Medium');
    setEditDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : ''); // format yyyy-mm-dd
  };

  const saveEdit = (id) => {
    if (!editTask.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    axios.put(`http://localhost:3001/update/${id}`, {
      task: editTask,
      priority: editPriority,
      dueDate: editDueDate || null,
    })
      .then(() => {
        setEditId(null);
        setEditTask('');
        setEditPriority('Medium');
        setEditDueDate('');
        fetchTodos();
      })
      .catch(err => console.log(err));
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTask('');
    setEditPriority('Medium');
    setEditDueDate('');
  };

  // Filter by search term
  const filteredTodos = todos.filter(todo =>
    todo.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by selected option
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortOption === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortOption === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0; // default no sorting
  });

  return (
    <div className='home'>
      <h2>Todo List</h2>
      <Create addTodo={addTodo} />

      {/* Search and Sort */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: 8, width: 320 }}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="">Sort By</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Task list */}
      {
        sortedTodos.length === 0 ? (
          <div><h2>No Record</h2></div>
        ) : (
          sortedTodos.map(todo => (
            <div className='task' key={todo._id}>

              <div className='checkbox' onClick={() => toggleDone(todo._id, todo.done)}>
                {todo.done
                  ? <BsFillCheckCircleFill className='icon' />
                  : <BsCircleFill className='icon' />
                }
              </div>

              <div style={{ flexGrow: 1, marginLeft: 10 }}>
                {editId === todo._id ? (
                  <>
                    <input
                      type="text"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                      style={{ padding: '5px', fontSize: '14px', width: '40%' }}
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      style={{ marginLeft: 10, padding: '5px', fontSize: '14px' }}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      style={{ marginLeft: 10, padding: '5px', fontSize: '14px' }}
                    />
                    <button onClick={() => saveEdit(todo._id)} style={{ marginLeft: 10 }}>Save</button>
                    <button onClick={cancelEdit} style={{ marginLeft: 5 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span className={todo.done ? 'line_through' : ''}>{todo.task}</span>
                    <BsPencilSquare
                      className="icon"
                      onClick={() => handleEditClick(todo)}
                      style={{ marginLeft: 8, cursor: 'pointer' }}
                      title="Edit Task"
                    />
                    <span style={{ marginLeft: 15, fontSize: 12, opacity: 0.7 }}>
                      [{todo.priority}]
                    </span>
                    {todo.dueDate && (
                      <span style={{ marginLeft: 10, fontSize: 12, opacity: 0.7 }}>
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </>
                )}
              </div>

              <div>
                <BsFillTrashFill className='icon' onClick={() => handleDelete(todo._id)} />
              </div>

            </div>
          ))
        )
      }
    </div>
  );
}

export default Home;
