import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { API_ENDPOINT } from '../../util';

export default function Add(props) {
  const userName = props.user.username;
  const [form, setForm] = useState({
    description: "",
    dueDate: "",
    userName: userName,
    completed: false,
  });
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    const newTask = { ...form };

    await fetch(`${API_ENDPOINT}/task/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
    .catch(error => {
      window.alert(error);
      return;
    });

    setForm({
      description: "",
      dueDate: "",
      userName: userName,
      completed: false,
    });
    navigate("/");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h1>Add New Task</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="description">Description</label>
          <input type="text"
            id="description"
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="datetime-local"
            id="dueDate"
            value={form.dueDate}
            onChange={(e) => updateForm({ dueDate: e.target.value })}
          />
        </div>
        <input type="submit" value="Add" />
      </form>
      <br />
      <Link to="/">&lt; Tasks List</Link>
    </div>
  );
}
