import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHumanFriendlyDateString } from '../../dateUtils';
import { API_ENDPOINT } from '../../util';

const Task = (props) => {
  let taskClass = null;
  if (props.task.completed) {
    taskClass = 'completed';
  } else if (Date.parse(props.task.dueDate) <= new Date()) {
    taskClass = 'overdue';
  }
  return (
    <tr className={taskClass}>
      <td>
        <input
          type="checkbox"
          id="completed"
          defaultChecked={props.task.completed}
          onChange={() => props.toggleCompleted(props.task)}
        />
      </td>
      <td className="description">{props.task.description}</td>
      <td className="due-date">
        {getHumanFriendlyDateString(props.task.dueDate)}
      </td>
      <td>
        <button
          className="delete"
          title="Delete"
          onClick={() => {props.deleteTask(props.task._id);}}>&times;</button>
      </td>
    </tr>
  );
};

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getTasks() {
      const response = await fetch(`${API_ENDPOINT}/tasks/`);

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

  async function toggleCompleted(task) {
    task.completed = !task.completed;
    await fetch(`${API_ENDPOINT}/task/update/${task._id}`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    // Update the state so we can re-render a completed item's styles
    const updatedTasks = tasks.map(existingTask => {
      if (existingTask._id === task._id){
        return {...existingTask, completed: task.completed};
      }
      return existingTask;
    });
    setTasks(updatedTasks);
  }

  async function deleteTask(id) {
    await fetch(`${API_ENDPOINT}/task/delete/${id}`, {method: "DELETE"});

    const newTasks = tasks.filter((el) => el._id !== id);
    setTasks(newTasks);
  }

  function taskList() {
    return tasks.map((task) => {
      return (
        <Task
          task={task}
          deleteTask={() => deleteTask(task._id)}
          toggleCompleted={() => toggleCompleted(task)}
          key={task._id}
        />
      );
    });
  }

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Description</th>
            <th>Due Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{taskList()}</tbody>
      </table>
      <br />
      <Link to="/add">+ Add Task</Link>
    </div>
  );
}
