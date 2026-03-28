import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Admin from './components/Admin';
import EditMovie from './components/EditMovie';
import Genres from './components/Genres';
import GraphQL from './components/GraphQL';
import Home from './components/Home';
import Login from './components/Login';
import Movies from './components/Movies';
import OneGenre from './components/OneGenre';
import OneMovie from './components/OneMovie';
import OneMovieGraphQL from './components/OneMovieGraphQL';

// --- Auth Context ---
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// --- Extras Page ---
function Extras() {
  const [activeUsers, setActiveUsers] = useState(0);

  return (
    <>
      <h2>Extras</h2>
      <hr />
      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => setActiveUsers((n) => n + 1)}
      >
        Add 1 user to count
      </button>
      <button
        className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => setActiveUsers((n) => n - 1)}
      >
        Subtract 1 user from count
      </button>
      <div className="mt-3">{activeUsers} user{activeUsers !== 1 ? 's' : ''} online</div>
    </>
  );
}

// --- Nav ---
function Nav() {
  const { jwt, logout } = useAuth();

  return (
    <nav>
      <ul className="flex flex-col border border-gray-200 rounded overflow-hidden">
        <li className="border-b border-gray-200 last:border-b-0">
          <Link className="block px-4 py-2 hover:bg-gray-50" to="/">Home</Link>
        </li>
        <li className="border-b border-gray-200 last:border-b-0">
          <Link className="block px-4 py-2 hover:bg-gray-50" to="/movies">Movies</Link>
        </li>
        <li className="border-b border-gray-200 last:border-b-0">
          <Link className="block px-4 py-2 hover:bg-gray-50" to="/genres">Genres</Link>
        </li>
        {jwt && (
          <>
            <li className="border-b border-gray-200 last:border-b-0">
              <Link className="block px-4 py-2 hover:bg-gray-50" to="/admin/movie/0">Add movie</Link>
            </li>
            <li className="border-b border-gray-200 last:border-b-0">
              <Link className="block px-4 py-2 hover:bg-gray-50" to="/admin">Manage Catalogue</Link>
            </li>
          </>
        )}
        <li className="border-b border-gray-200 last:border-b-0">
          <Link className="block px-4 py-2 hover:bg-gray-50" to="/graphql">GraphQL</Link>
        </li>
        <li className="border-b border-gray-200 last:border-b-0">
          <Link className="block px-4 py-2 hover:bg-gray-50" to="/extras">Extras</Link>
        </li>
      </ul>
    </nav>
  );
}

// --- Header ---
function Header() {
  const { jwt, logout } = useAuth();

  return (
    <div className="flex items-center justify-between mt-3 pb-3 border-b border-gray-300">
      <h1 className="text-2xl font-bold">Go Watch a Movie!</h1>
      <div>
        {jwt ? (
          <Link to="/" onClick={logout}>
            Logout
          </Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

// --- App ---
export default function App() {
  const [jwt, setJwt] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      try {
        setJwt(JSON.parse(token));
      } catch {
        window.localStorage.removeItem('jwt');
      }
    }
  }, []);

  const handleJWTChange = useCallback((token) => {
    setJwt(token);
  }, []);

  const logout = useCallback(() => {
    setJwt('');
    window.localStorage.removeItem('jwt');
  }, []);

  return (
    <AuthContext.Provider value={{ jwt, handleJWTChange, logout }}>
      <Router>
        <div className="max-w-7xl mx-auto px-4">
          <Header />
          <div className="flex gap-6 mt-4">
            <div className="w-48 shrink-0">
              <Nav />
            </div>
            <div className="flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movies/:id" element={<OneMovie />} />
                <Route path="/moviesgraphql/:id" element={<OneMovieGraphQL />} />
                <Route path="/genres" element={<Genres />} />
                <Route path="/genre/:id" element={<OneGenre />} />
                <Route path="/graphql" element={<GraphQL />} />
                <Route path="/admin/movie/:id" element={<EditMovie />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/extras" element={<Extras />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
