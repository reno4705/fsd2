/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';

function App() {

  return (
    <>
      <ToastContainer/>
      <Router>
        <Routes>
          <Route path="/" element={<Register />}/>
          <Route path="/login" element={<Login />} />
          <Route path='/dashboard' element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;