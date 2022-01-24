import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { Box, Button, TextField } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DateTimePicker from "../../components/DateTimePicker";
import { fetchFromApi, getTokenForUser } from "../../util";

export default function Edit({ user }) {
  const userToken = getTokenForUser(user);
  const userName = user.username;
  const [loading, setLoading] = useState(true);
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
      const response = await fetchFromApi(`/task/${params.id.toString()}`, userToken);

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

    fetchData().then(() => setLoading(false));
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

    await fetchFromApi(`/task/update/${params.id}`, userToken, {
      method: 'POST',
      body: JSON.stringify(editedTask),
    });

    navigate('/');
  }

  return loading ? <Loader /> : (
    <div>
      <h1>Update Task</h1>
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
        <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>Update</Button>
      </Box>
      <br />
      <Button component={Link} to="/" variant="outlined" size="small" startIcon={<ArrowBackIcon />}>
        Back to Tasks List
      </Button>
    </div>
  );
}
