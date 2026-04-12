import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getAccountsRequest } from '../api/accountApi';
import type { Account } from '../types/account';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await getAccountsRequest();
        setAccounts(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Failed to load accounts'));
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, []);

  return (
    <Layout>
      <h1>My Accounts</h1>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      <div className="grid">
        {accounts.map((account) => (
          <div key={account.id} className="card">
            <p><strong>Account ID:</strong> {account.id}</p>
            <p><strong>Account Number:</strong> {account.accountNumber}</p>
            <p><strong>Balance:</strong> {account.balance}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={account.isBlocked ? 'blocked' : 'active'}>
                {account.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </p>

            <Link to={`/accounts/${account.id}`}>
              <button>Open Account</button>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}