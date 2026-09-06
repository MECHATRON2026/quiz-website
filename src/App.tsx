import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 flex gap-4 bg-gray-100">
        <Link to="/login">Login</Link>
        <Link to="/lobby">Lobby</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/results">Results</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
