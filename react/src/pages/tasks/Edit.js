import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import config from '../../config';

export default function Edit({ user }) {
  const { API_ENDPOINT, API_KEY } = config.api;
  const userToken = user.getSignInUserSession().getIdToken().getJwtToken();
  const userName = user.username;
  const [form, setForm] = useState({
    description: "",
    dueDate: "",
    userName: userName,
    completed: false,
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`${API_ENDPOINT}/task/${params.id.toString()}`, {
        headers: {
          'Authorization': userToken,
          'x-api-key': API_KEY,
        },
      });

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const task = await response.json();
      if (!task) {
        window.alert(`Task with id ${id} not found`);
        navigate('/');
        return;
      }

      setForm(task);
    }

    fetchData();
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
      userName: userName,
      completed: form.completed,
    };

    await fetch(`${API_ENDPOINT}/task/update/${params.id}`, {
      method: 'POST',
      body: JSON.stringify(editedTask),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken,
        'x-api-key': API_KEY,
      },
    });

    navigate('/');
  }

  return (
    <div>
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
