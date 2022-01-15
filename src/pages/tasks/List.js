import React, { useEffect, useState } from 'react';

const Task = (props) => (
  <tr>
    <td>{props.task.description}</td>
    <td>{props.task.dueDate}</td>
    <td>
      <a href={`/edit/${props.task._id}`}>Edit</a> |
      <button onClick={() => {props.deleteTask(props.task._id);}}>Delete</button>
    </td>
  </tr>
);

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getTasks() {
      const response = await fetch(`http://localhost:5000/tasks/`);

        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }

        const tasks = await response.json();
        setTasks(tasks);
      }

      getTasks();

      return;
    }, [tasks.length]);

    async function deleteTask(id) {
      await fetch(`http://localhost:5000/${id}`, {method: "DELETE"});

      const newTasks = tasks.filter((el) => el._id !== id);
      setTasks(newTasks);
    }

    function taskList() {
      return tasks.map((task) => {
        return (
          <Task
            task={task}
            deleteTask={() => deleteTask(task._id)}
            key={task._id}
          />
        );
      });
    }

    return (
      <div>
        <h3>To-Do List</h3>
        <a href="/add">Add Task</a>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{taskList()}</tbody>
        </table>
      </div>
    );
}