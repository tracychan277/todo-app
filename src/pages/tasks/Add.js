import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Add() {
  const [form, setForm] = useState({
    description: "",
    dueDate: "",
    userName: "tracy",
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

    await fetch("http://localhost:5000/task/add", {
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

    setForm({ description: "", dueDate: "", userName: "tracy" });
    navigate("/");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h3>Create New Record</h3>
      <form onSubmit={onSubmit}>
        <label htmlFor="description">Description</label>
        <input type="text"
          id="description"
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
        />
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="datetime-local"
          id="dueDate"
          value={form.dueDate}
          onChange={(e) => updateForm({ dueDate: e.target.value })}
        />
        <input type="submit" value="Add" />
      </form>
    </div>
  );
}
