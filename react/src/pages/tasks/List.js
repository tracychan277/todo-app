import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHumanFriendlyDateString } from '../../dateUtils';
import Loader from '../../components/Loader';
import {
  Checkbox,
  IconButton,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Close';
import AddIcon from "@mui/icons-material/Add";
import WarningIcon from '@mui/icons-material/Warning';
import { fetchFromApi } from "../../util";

const Task = ({ task, deleteTask, user }) => {
  const overdue = Date.parse(task.dueDate) <= new Date();
  const [checked, setChecked] = useState(task.completed);

  async function handleToggle(e, task) {
    // Disable default check/uncheck behaviour, so we can set the 'checked' status from the state
    e.preventDefault();
    setChecked(prevChecked => !prevChecked);
    await fetchFromApi(`/task/update/${task._id}`, user, {
      method: 'POST',
      body: JSON.stringify({...task, completed: !checked}),
    });
  }

  let taskClass = null;
  if (checked) {
    taskClass = 'completed';
  } else if (overdue) {
    taskClass = 'overdue';
  }
  const labelId = `checkbox-list-label-${task._id}`;

  return (
    <ListItem key={task._id}
              secondaryAction={
                <IconButton edge="end" aria-label="Delete" onClick={() => deleteTask(task._id)}>
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
              className={taskClass}
    >
      <ListItemButton role={undefined} onClick={(e) => handleToggle(e, task)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
            onChange={(e) => handleToggle(e, task)}
          />
        </ListItemIcon>
        <ListItemText id={labelId}
                      primary={task.description}
                      secondary={getHumanFriendlyDateString(task.dueDate)}
                      className="description"
        />
        {!checked && overdue ? <Tooltip title="This task is overdue"><WarningIcon color="error" /></Tooltip> : null}
        {/*<IconButton component={Link} to={`/edit/${task._id}`} aria-label="Edit">*/}
        {/*  <EditIcon />*/}
        {/*</IconButton>*/}
      </ListItemButton>
    </ListItem>
  );
};

export default function TaskList({ user }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getTasks() {
      const response = await fetchFromApi('/tasks/', user);

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
    await fetchFromApi(`/task/delete/${id}`, user, {method: 'DELETE'});

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
          user={user}
        />
      );
    });
  }

  return loading ? <Loader /> :
    (
      <div>
        <h1 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          To-Do List
          <Fab component={Link} to="/add" color="primary" aria-label="Add"><AddIcon /></Fab>
        </h1>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {taskList()}
        </List>
      </div>
    );
}
