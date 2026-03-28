import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from './form-components/Input';

const API_URL = process.env.REACT_APP_API_URL;

async function fetchGraphQL(payload) {
  const response = await fetch(`${API_URL}/v1/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  });
  return response.json();
}

export default function GraphQL() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const payload = `{ list { id title runtime year description } }`;
    fetchGraphQL(payload).then((data) => {
      setMovies(Object.values(data.data.list));
    });
  }, []);

  const performSearch = useCallback((term) => {
    const payload = `{ search(titleContains: "${term}") { id title runtime year description } }`;
    fetchGraphQL(payload).then((data) => {
      const results = Object.values(data.data.search);
      setMovies(results.length > 0 ? results : []);
    });
  }, []);

  const handleChange = useCallback(
    (event) => {
      const value = event.target.value;
      setSearchTerm(value);

      if (value.length > 2) {
        performSearch(value);
      } else if (value.length === 0) {
        // Re-fetch full list when search is cleared
        const payload = `{ list { id title runtime year description } }`;
        fetchGraphQL(payload).then((data) => {
          setMovies(Object.values(data.data.list));
        });
      } else {
        setMovies([]);
      }
    },
    [performSearch]
  );

  return (
    <>
      <h2>GraphQL</h2>
      <hr />
      <Input
        title="Search"
        type="text"
        name="search"
        value={searchTerm}
        handleChange={handleChange}
      />
      <div className="flex flex-col border border-gray-200 rounded overflow-hidden mt-2">
        {movies.map((m) => (
          <Link
            key={m.id}
            className="px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            to={`/moviesgraphql/${m.id}`}
          >
            <strong>{m.title}</strong>
            <br />
            <small className="text-gray-500">
              ({m.year}) - {m.runtime} minutes
            </small>
            <br />
            {m.description.slice(0, 100)}...
          </Link>
        ))}
      </div>
    </>
  );
}
