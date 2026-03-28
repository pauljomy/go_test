import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Invalid response code: ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        setGenres(json.genres);
        setIsLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setIsLoaded(true);
      });
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <>
      <h2>Genres</h2>
      <div className="flex flex-col border border-gray-200 rounded overflow-hidden mt-2">
        {genres.map((m) => (
          <Link
            key={m.id}
            className="px-4 py-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            to={`/genre/${m.id}`}
            state={{ genreId: m.id, genreName: m.genre_name }}
          >
            {m.genre_name}
          </Link>
        ))}
      </div>
    </>
  );
}
