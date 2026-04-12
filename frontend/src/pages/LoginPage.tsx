import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';
import { loginRequest } from '../api/authApi';
import { hashPassword } from '../utils/hashPassword';
import { useAuth } from '../auth/useAuth';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const apiError = error as ApiError;
    return apiError.response?.data?.message || 'Login failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Login failed';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const passwordHash = await hashPassword(form.password);
      const data = await loginRequest(form.login, passwordHash);

      login(data.token, data.user);

      if (data.user.role === 'ADMIN') {
        navigate('/admin/accounts');
      } else {
        navigate('/accounts');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="auth-card">
        <h1>Login</h1>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Login"
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p>
          No account yet? <Link to="/register">Register</Link>
        </p>
      </div>
    </Layout>
  );
}