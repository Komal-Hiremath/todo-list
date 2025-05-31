import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsFillTrashFill, BsFillCheckCircleFill, BsCircleFill, BsPencilSquare } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
    setEditDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : '');
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

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const currentDay = today.getDay();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - currentDay);
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    const d = new Date(date);
    return d >= firstDay && d <= lastDay;
  };

  const isOverdue = (date) => {
    const now = new Date();
    const d = new Date(date);
    return d < now && !isToday(date);
  };

  const daysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.task.toLowerCase().includes(searchTerm.toLowerCase());

    const dueDateFilter = () => {
      if (!filterOption) return true;
      if (!todo.dueDate) return false;
      if (filterOption === 'today') return isToday(todo.dueDate);
      if (filterOption === 'thisWeek') return isThisWeek(todo.dueDate);
      if (filterOption === 'overdue') return isOverdue(todo.dueDate);
      return true;
    };

    return matchesSearch && dueDateFilter();
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortOption === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortOption === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  return (
    <div className='home' style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer', color: 'white' }} onClick={handleLogout} title="Logout">
        <FiLogOut size={28} />
      </div>

      <h2>Todo List</h2>
      <Create addTodo={addTodo} />

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: 8, width: 320 }}
        />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ padding: 8 }}>
          <option value="">Sort By</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
        <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)} style={{ padding: 8 }}>
          <option value="">Filter By</option>
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {sortedTodos.length === 0 ? (
        <div><h2>No Record</h2></div>
      ) : (
        sortedTodos.map(todo => {
          const overdue = !todo.done && todo.dueDate && isOverdue(todo.dueDate);
          const days = todo.dueDate ? daysLeft(todo.dueDate) : null;

          return (
            <div
              className={`task ${overdue ? 'overdue' : ''} ${todo.priority}`}
              key={todo._id}
            >
              <div className='checkbox' onClick={() => toggleDone(todo._id, todo.done)}>
                {todo.done
                  ? <BsFillCheckCircleFill className='icon' />
                  : <BsCircleFill className='icon' />}
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
                    <br />
                    {todo.dueDate && (
                      <span style={{ marginLeft: 10, fontSize: 12, opacity: 0.7 }}>
                        Date: {new Date(todo.dueDate).toLocaleDateString()} (
                        {days < 0
                          ? `${Math.abs(days)} days overdue`
                          : days === 0
                          ? 'Today'
                          : `${days} days left`}
                        )
                      </span>
                    )}
                  </>
                )}
              </div>

              <div>
                <BsFillTrashFill className='icon' onClick={() => handleDelete(todo._id)} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Home;
