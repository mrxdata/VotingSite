import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './components/Dashboard';
import VotingPage from "./pages/VotingPage";
import './App.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/events/:eventId" element={<VotingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
