import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskAdd from './pages/tasks/Add';
import TaskEdit from './pages/tasks/Edit';
import TaskList from './pages/tasks/List';

const App = () => {
 return (
   <Router>
     <Routes>
       <Route exact path="/" element={<TaskList />} />
       <Route path="/add" element={<TaskAdd />} />
       <Route path="/edit/:id" element={<TaskEdit />} />
     </Routes>
   </Router>
 );
};

export default App;
