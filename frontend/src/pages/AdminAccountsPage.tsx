import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import {
  getAllAccountsRequest,
  unblockAccountRequest,
  blockAccountRequest,
} from '../api/adminApi';
import type { AdminAccount } from '../types/account';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadAccounts(searchValue = '') {
    try {
      const data = await getAllAccountsRequest(searchValue);
      setAccounts(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load admin accounts'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    await loadAccounts(search);
  }

  async function handleBlock(accountId: number) {
    setError('');

    try {
      await blockAccountRequest(accountId);
      await loadAccounts(search);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Block failed'));
    }
  }

  async function handleUnblock(accountId: number) {
    setError('');

    try {
      await unblockAccountRequest(accountId);
      await loadAccounts(search);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unblock failed'));
    }
  }

  return (
    <Layout>
      <h1>Admin Accounts</h1>

      <div style={{ marginBottom: '16px' }}>
        <Link to="/admin/create-user">
          <button>Create User / Admin</button>
        </Link>
      </div>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by user login"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      <div className="grid">
        {accounts.map((account) => (
          <div key={account.id} className="card">
            <p><strong>User Login:</strong> {account.user.login}</p>
            <p><strong>Account ID:</strong> {account.id}</p>
            <p>
              <strong>Account Number:</strong>{' '}
              <Link to={`/admin/accounts/${account.id}`}>{account.accountNumber}</Link>
            </p>
            <p><strong>Balance:</strong> {account.balance}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={account.isBlocked ? 'blocked' : 'active'}>
                {account.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </p>

            {account.isBlocked ? (
              <button onClick={() => handleUnblock(account.id)}>
                Unblock Account
              </button>
            ) : (
              <button onClick={() => handleBlock(account.id)}>
                Block Account
              </button>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}