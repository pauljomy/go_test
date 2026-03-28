import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import Input from './form-components/Input';
import Alert from './ui-components/Alert';

export default function Login() {
  const { handleJWTChange } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [alert, setAlert] = useState({ type: 'd-none', message: '' });

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  }, []);

  const hasError = (key) => errors.includes(key);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const validationErrors = [];
      if (!email) validationErrors.push('email');
      if (!password) validationErrors.push('password');
      setErrors(validationErrors);
      if (validationErrors.length > 0) return;

      const data = new FormData(event.target);
      const payload = Object.fromEntries(data.entries());

      fetch(`${process.env.REACT_APP_API_URL}/v1/signin`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setAlert({ type: 'alert-danger', message: data.error.message });
          } else {
            const token = Object.values(data)[0];
            handleJWTChange(token);
            window.localStorage.setItem('jwt', JSON.stringify(token));
            navigate('/admin');
          }
        });
    },
    [email, password, handleJWTChange, navigate]
  );

  return (
    <>
      <h2>Login</h2>
      <hr />
      <Alert alertType={alert.type} alertMessage={alert.message} />

      <form className="mt-3" onSubmit={handleSubmit}>
        <Input
          title="Email"
          type="email"
          name="email"
          handleChange={handleChange}
          className={hasError('email') ? 'is-invalid' : ''}
          errorDiv={hasError('email') ? 'text-danger' : 'd-none'}
          errorMsg="Please enter a valid email address"
        />

        <Input
          title="Password"
          type="password"
          name="password"
          handleChange={handleChange}
          className={hasError('password') ? 'is-invalid' : ''}
          errorDiv={hasError('password') ? 'text-danger' : 'd-none'}
          errorMsg="Please enter a password"
        />

        <hr />
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
      </form>
    </>
  );
}
