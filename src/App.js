import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './pages/tasks/List';

const App = () => {
 return (
   <Router>
     <Routes>
       <Route exact path="/" element={<TaskList />} />
     </Routes>
   </Router>
 );
};

export default App;
