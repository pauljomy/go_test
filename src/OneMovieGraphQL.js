import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function OneMovieGraphQL() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const payload = `{
      movie(id: ${id}) {
        id title runtime year description
        release_date rating mpaa_rating poster
      }
    }`;

    fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        setMovie(data.data.movie);
        setIsLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setIsLoaded(true);
      });
  }, [id]);

  if (error) return <div>Error: {error.message}</div>;
  if (!isLoaded) return <p>Loading...</p>;

  const genres = movie.genres ? Object.values(movie.genres) : [];

  return (
    <>
      <h2>
        Movie: {movie.title} ({movie.year})
      </h2>

      {movie.poster && (
        <div className="mt-2">
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
            alt="poster"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-2">
        <small>Rating: {movie.mpaa_rating}</small>
        <div className="flex flex-wrap gap-1">
          {genres.map((m, index) => (
            <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded" key={index}>
              {m}
            </span>
          ))}
        </div>
      </div>

      <hr className="my-3" />

      <table className="w-full text-sm border-collapse">
        <thead></thead>
        <tbody>
          <tr className="border-b border-gray-200 odd:bg-gray-50">
            <td className="py-2 pr-4 font-semibold w-32">Title:</td>
            <td className="py-2">{movie.title}</td>
          </tr>
          <tr className="border-b border-gray-200 odd:bg-gray-50">
            <td className="py-2 pr-4 font-semibold">Description</td>
            <td className="py-2">{movie.description}</td>
          </tr>
          <tr className="border-b border-gray-200 odd:bg-gray-50">
            <td className="py-2 pr-4 font-semibold">Run time:</td>
            <td className="py-2">{movie.runtime} minutes</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
