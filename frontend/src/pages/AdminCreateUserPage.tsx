import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';
import {
  createAdminRequest,
  createClientRequest,
} from '../api/adminApi';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function AdminCreateUserPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: '',
    password: '',
    role: 'CLIENT',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (form.role === 'ADMIN') {
        await createAdminRequest(form.login, form.password);
        setSuccess('Admin created successfully');
      } else {
        await createClientRequest(form.login, form.password);
        setSuccess('Client created successfully');
      }

      setForm({
        login: '',
        password: '',
        role: 'CLIENT',
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to create user'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <button onClick={() => navigate('/admin/accounts')}>Back to Admin Accounts</button>

      <div className="auth-card">
        <h1>Create New User</h1>

        {error && <ErrorMessage message={error} />}
        {success && <p>{success}</p>}

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

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CLIENT">Client</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </Layout>
  );
}