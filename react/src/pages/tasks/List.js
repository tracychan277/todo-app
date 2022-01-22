import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHumanFriendlyDateString } from '../../dateUtils';
import config from '../../config';
import Loader from '../../components/Loader';
import { Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";

const Task = ({ task, deleteTask, toggleCompleted }) => {
  let taskClass = null;
  if (task.completed) {
    taskClass = 'completed';
  } else if (Date.parse(task.dueDate) <= new Date()) {
    taskClass = 'overdue';
  }
  return (
    <TableRow
      key={task._id}
      className={taskClass}
    >
      <TableCell component="th" scope="row" padding={'none'}>
        <Checkbox defaultChecked={task.completed} onChange={() => toggleCompleted(task)} />
      </TableCell>
      <TableCell className="description">{task.description}</TableCell>
      <TableCell className="due-date">{getHumanFriendlyDateString(task.dueDate)}</TableCell>
      <TableCell>
        <Button component={Link} to={`/edit/${task._id}`}><EditIcon /></Button>
        <Button onClick={() => {deleteTask(task._id);}}><DeleteIcon /></Button>
      </TableCell>
    </TableRow>
  );
};

export default function TaskList({ user }) {
  const { API_ENDPOINT, API_KEY } = config.api;
  const userToken = user.getSignInUserSession().getIdToken().getJwtToken();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getTasks() {
      const response = await fetch(`${API_ENDPOINT}/tasks/`, {
        headers: {
          'Authorization': userToken,
          'x-api-key': API_KEY,
        },
      });

      if (!response.ok) {
        const message = `An error occurred: ${response.status} ${response.statusText}`;
        window.alert(message);
        return;
      }

      const tasks = await response.json();
      setTasks(tasks);
    }

    getTasks().then(() => setLoading(false));
  }, [tasks.length]);

  async function toggleCompleted(currentTask) {
    currentTask.completed = !currentTask.completed;
    // await fetch(`${API_ENDPOINT}/task/update/${currentTask._id}`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': userToken,
    //     'x-api-key': API_KEY,
    //   },
    //   body: JSON.stringify(currentTask),
    // });

    // Update the state, so we can re-render a completed item's styles
    const updatedTasks = tasks.map(existingTask => {
      if (existingTask._id === currentTask._id){
        return {...existingTask, completed: currentTask.completed};
      }
      return existingTask;
    });
    setTasks(updatedTasks);
  }

  async function deleteTask(id) {
    await fetch(`${API_ENDPOINT}/task/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': userToken,
        'x-api-key': API_KEY,
      },
    });

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

  return loading ? <Loader /> :
    (
      <div>
        <h1>To-Do List</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {taskList()}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <Button component={Link} to="/add" variant="contained" startIcon={<AddIcon />}>Add Task</Button>
      </div>
    );
}
