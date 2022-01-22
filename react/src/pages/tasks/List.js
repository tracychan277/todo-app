import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHumanFriendlyDateString } from '../../dateUtils';
import config from '../../config';
import Loader from '../../components/Loader';
import { Button, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";

const { API_ENDPOINT, API_KEY } = config.api;

const Task = ({ task, deleteTask, userToken }) => {

  const [checked, setChecked] = useState(task.completed);

  async function handleToggle(e, task) {
    // Disable default check/uncheck behaviour so we can set the 'checked' status from the state
    e.preventDefault();
    setChecked(prevChecked => !prevChecked);
    await fetch(`${API_ENDPOINT}/task/update/${task._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken,
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({...task, completed: !checked}),
    });
  }

  let taskClass = null;
  if (checked) {
    taskClass = 'completed';
  } else if (Date.parse(task.dueDate) <= new Date()) {
    taskClass = 'overdue';
  }

  return (
    // <TableRow
    //   key={task._id}
    //   className={taskClass}
    // >
    //   <TableCell component="th" scope="row" padding={'none'}>
    //     <Checkbox defaultChecked={task.completed} onChange={() => toggleCompleted(task)} />
    //   </TableCell>
    //   <TableCell className="description">{task.description}</TableCell>
    //   <TableCell className="due-date">{getHumanFriendlyDateString(task.dueDate)}</TableCell>
    //   <TableCell>
    //     <IconButton component={Link} to={`/edit/${task._id}`}><EditIcon /></IconButton>
    //     <IconButton onClick={() => {deleteTask(task._id);}}><DeleteIcon /></IconButton>
    //   </TableCell>
    // </TableRow>
    <ListItem key={task._id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task._id)}>
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
              className={taskClass}
    >
      <ListItemButton role={undefined} onClick={(e) => handleToggle(e, task)} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': task._id }}
            onChange={() => handleToggle(task)}
          />
        </ListItemIcon>
        <ListItemText id={task._id} primary={task.description} className="description" />
      </ListItemButton>
    </ListItem>
  );
};

export default function TaskList({ user }) {
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
          key={task._id}
          userToken={userToken}
        />
      );
    });
  }

  return loading ? <Loader /> :
    (
      <div>
        <h1 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          To-Do List
          <Button component={Link} to="/add" variant="contained" startIcon={<AddIcon />}>Add Task</Button>
        </h1>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {taskList()}
        </List>
      </div>
    );
}
