import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { API_ENDPOINT } from '../../util';

export default function Edit() {
  const [form, setForm] = useState({
    description: "",
    dueDate: "",
    userName: "tracy",
    completed: false,
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`${API_ENDPOINT}/task/${params.id.toString()}`);

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const task = await response.json();
      if (!task) {
        window.alert(`Task with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(task);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedTask = {
      description: form.description,
      dueDate: form.dueDate,
      userName: "tracy",
      completed: form.completed,
    };

    await fetch(`${API_ENDPOINT}/task/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify(editedTask),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    navigate("/");
  }

  return (
    <div className="container">
      <h1>Update Task</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="description">Description: </label>
          <input
            type="text"
            id="description"
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="dueDate">Due Date: </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={form.dueDate}
            onChange={(e) => updateForm({ dueDate: e.target.value })}
          />
        </div>
        <input type="submit" value="Update Task" />
      </form>
      <br />
      <Link to="/">&lt; Tasks List</Link>
    </div>
  );
}
