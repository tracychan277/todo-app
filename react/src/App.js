import './App.css';
import Amplify, { Auth } from 'aws-amplify';
import config from './config';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Container from '@mui/material/Container';
import NavBar from './components/NavBar';
import TaskAdd from './pages/tasks/Add';
import TaskEdit from './pages/tasks/Edit';
import TaskList from './pages/tasks/List';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
});

const App = ({ signOut, user }) => {
  return (
    <Router>
      <NavBar signOut={signOut} />
      <Container maxWidth="sm">
        <Routes>
          <Route exact path="/" element={<TaskList />} />
          <Route path="/add" element={<TaskAdd />} />
          <Route path="/edit/:id" element={<TaskEdit />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default withAuthenticator(App);
