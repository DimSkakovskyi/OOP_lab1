import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getAccountDetailsRequest, blockAccountRequest } from '../api/accountApi';
import type { AccountDetails } from '../types/account';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function AccountDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const accountId = Number(id);

  const [details, setDetails] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDetails = useCallback(async () => {
    try {
      const data = await getAccountDetailsRequest(accountId);
      setDetails(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load account details'));
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  async function handleBlock() {
    setError('');

    try {
      await blockAccountRequest(accountId);
      await loadDetails();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Block failed'));
    }
  }

  return (
    <Layout>
      <button onClick={() => navigate('/accounts')}>Back to Accounts</button>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {details && (
        <>
          <h1>Account Details</h1>

          <div className="section">
            <p><strong>Account ID:</strong> {details.account.id}</p>
            <p><strong>Account Number:</strong> {details.account.accountNumber}</p>
            <p><strong>Balance:</strong> {details.account.balance}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={details.account.isBlocked ? 'blocked' : 'active'}>
                {details.account.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </p>
          </div>

          <div className="section">
            <h2>Cards</h2>
            <ul>
              {details.cards.map((card) => (
                <li key={card.id}>
                  <Link to={`/accounts/${details.account.id}/cards/${card.id}`}>
                    {card.cardNumber} — {card.expiryDate}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Block Account</h2>
            <button onClick={handleBlock}>Block Account</button>
          </div>

          <div className="section">
            <h2>Operation History</h2>
            <ul>
              {details.payments.map((payment) => (
                <li key={payment.id}>
                  {payment.type} — {payment.amount} — {payment.description ?? 'No description'} — {payment.createdAt}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Layout>
  );
}