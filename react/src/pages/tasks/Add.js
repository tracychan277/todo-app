import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import config from '../../config';
import { Box, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DateTimePicker from '../../components/DateTimePicker';

export default function Add({ user }) {
  const { API_ENDPOINT, API_KEY } = config.api;
  const userToken = user.getSignInUserSession().getIdToken().getJwtToken();
  const userName = user.username;
  const [form, setForm] = useState({
    description: "",
    dueDate: new Date(),
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken,
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(newTask),
    })
    .catch(error => {
      window.alert(error);
    });

    setForm({
      description: "",
      dueDate: new Date(),
      userName: userName,
      completed: false,
    });
    navigate("/");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h1>Add New Task</h1>
      <Box component="form"
           sx={{
             '& .MuiTextField-root': { m: 1, width: '25ch' },
             '& .MuiButton-root': { m: 1, width: '25ch' },
           }}
           onSubmit={onSubmit}
      >
        <div>
          <TextField required
                     focused
                     id="description"
                     label="Description"
                     variant="outlined"
                     size="small"
                     value={form.description}
                     onChange={(e) => updateForm({ description: e.target.value })}
          />
        </div>
        <div>
          <DateTimePicker required
                          id="dueDate"
                          label="Due Date"
                          value={form.dueDate}
                          onChange={(newValue) => updateForm({ dueDate: newValue })}
          />
        </div>
        <Button type="submit" variant="contained" startIcon={<AddIcon />}>Add</Button>
      </Box>
      <br />
      <Button component={Link} to="/" variant="outlined" startIcon={<ArrowBackIcon />}>Back to Tasks List</Button>
    </div>
  );
}
