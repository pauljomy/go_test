import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

export default function OneGenre() {
  const { id } = useParams();
  const { state } = useLocation();

  const [movies, setMovies] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Support both location state (from Genres nav) and direct URL access
  const genreName = state?.genreName ?? '';
  const genreId = state?.genreId ?? id;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/movies/${genreId}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Invalid response code: ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        setMovies(json.movies ?? []);
        setIsLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setIsLoaded(true);
      });
  }, [genreId]);

  if (error) return <div>Error: {error.message}</div>;
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <>
      <h2>Genre: {genreName}</h2>
      <div className="flex flex-col border border-gray-200 rounded overflow-hidden mt-2">
        {movies.map((m) => (
          <Link
            key={m.id}
            to={`/movies/${m.id}`}
            className="px-4 py-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
          >
            {m.title}
          </Link>
        ))}
      </div>
    </>
  );
}
