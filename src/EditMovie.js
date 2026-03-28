import { useCallback, useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../App';
import './EditMovie.css';
import Input from './form-components/Input';
import Select from './form-components/Select';
import TextArea from './form-components/TextArea';
import Alert from './ui-components/Alert';

const EMPTY_MOVIE = {
  id: 0,
  title: '',
  release_date: '',
  runtime: '',
  mpaa_rating: '',
  rating: '',
  description: '',
};

const MPAA_OPTIONS = [
  { id: 'G', value: 'G' },
  { id: 'PG', value: 'PG' },
  { id: 'PG13', value: 'PG13' },
  { id: 'R', value: 'R' },
  { id: 'NC17', value: 'NC17' },
];

export default function EditMovie() {
  const { id } = useParams();
  const { jwt } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(EMPTY_MOVIE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState([]);
  const [alert, setAlert] = useState({ type: 'd-none', message: '' });

  useEffect(() => {
    if (!jwt) {
      navigate('/login');
      return;
    }

    if (Number(id) > 0) {
      fetch(`${process.env.REACT_APP_API_URL}/v1/movie/${id}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Invalid response code: ' + response.status);
          }
          return response.json();
        })
        .then((json) => {
          const releaseDate = new Date(json.movie.release_date);
          setMovie({
            id,
            title: json.movie.title,
            release_date: releaseDate.toISOString().split('T')[0],
            runtime: json.movie.runtime,
            mpaa_rating: json.movie.mpaa_rating,
            rating: json.movie.rating,
            description: json.movie.description,
          });
          setIsLoaded(true);
        })
        .catch(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, [id, jwt, navigate]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setMovie((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const validationErrors = [];
      if (!movie.title) validationErrors.push('title');
      setErrors(validationErrors);
      if (validationErrors.length > 0) return;

      const data = new FormData(event.target);
      const payload = Object.fromEntries(data.entries());
      const myHeaders = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt,
      });

      fetch(`${process.env.REACT_APP_API_URL}/v1/admin/editmovie`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setAlert({ type: 'alert-danger', message: data.error.message });
          } else {
            setAlert({ type: 'alert-success', message: 'Changes saved!' });
          }
        });
    },
    [movie.title, jwt]
  );

  const confirmDelete = useCallback(() => {
    confirmAlert({
      title: 'Delete Movie?',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const myHeaders = new Headers({
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + jwt,
            });

            fetch(
              `${process.env.REACT_APP_API_URL}/v1/admin/deletemovie/${movie.id}`,
              { method: 'GET', headers: myHeaders }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.error) {
                  setAlert({ type: 'alert-danger', message: data.error.message });
                } else {
                  navigate('/admin');
                }
              });
          },
        },
        { label: 'No', onClick: () => {} },
      ],
    });
  }, [jwt, movie.id, navigate]);

  const hasError = (key) => errors.includes(key);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <>
      <h2>Add/Edit Movie</h2>
      <Alert alertType={alert.type} alertMessage={alert.message} />
      <hr />

      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="id"
          id="id"
          value={movie.id}
          onChange={handleChange}
        />

        <Input
          title="Title"
          className={hasError('title') ? 'is-invalid' : ''}
          type="text"
          name="title"
          value={movie.title}
          handleChange={handleChange}
          errorDiv={hasError('title') ? 'text-danger' : 'd-none'}
          errorMsg="Please enter a title"
        />

        <Input
          title="Release date"
          type="date"
          name="release_date"
          value={movie.release_date}
          handleChange={handleChange}
        />

        <Input
          title="Runtime"
          type="text"
          name="runtime"
          value={movie.runtime}
          handleChange={handleChange}
        />

        <Select
          title="MPAA Rating"
          name="mpaa_rating"
          options={MPAA_OPTIONS}
          value={movie.mpaa_rating}
          handleChange={handleChange}
          placeholder="Choose..."
        />

        <Input
          title="Rating"
          type="text"
          name="rating"
          value={movie.rating}
          handleChange={handleChange}
        />

        <TextArea
          title="Description"
          name="description"
          value={movie.description}
          rows="3"
          handleChange={handleChange}
        />

        <hr />

        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
        <Link to="/admin" className="ml-1 inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Cancel
        </Link>
        {Number(movie.id) > 0 && (
          <button
            type="button"
            onClick={confirmDelete}
            className="ml-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </form>
    </>
  );
}
