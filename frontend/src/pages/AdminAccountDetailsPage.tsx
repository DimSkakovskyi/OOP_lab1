import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import {
  getAdminAccountDetailsRequest,
  blockAccountRequest,
  unblockAccountRequest,
} from '../api/adminApi';
import type { AdminAccountDetails } from '../types/account';
import { getErrorMessage } from '../utils/getErrorMessage';
import { addCardToAccountRequest } from '../api/adminApi';
import { validateExpiryDate } from '../utils/validateExpiryDate';

export default function AdminAccountDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const accountId = Number(id);

  const [details, setDetails] = useState<AdminAccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCardExpiryDate, setNewCardExpiryDate] = useState('');

  const loadDetails = useCallback(async () => {
    try {
      const data = await getAdminAccountDetailsRequest(accountId);
      setDetails(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load admin account details'));
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  async function handleBlockToggle() {
    if (!details) {
      return;
    }

    setError('');

    try {
      if (details.account.isBlocked) {
        await unblockAccountRequest(accountId);
      } else {
        await blockAccountRequest(accountId);
      }

      await loadDetails();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to change account status'));
    }
  }

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validateExpiryDate(newCardExpiryDate);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await addCardToAccountRequest(accountId, newCardExpiryDate);
      setNewCardExpiryDate('');
      await loadDetails();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to add card'));
    }
  }

  return (
    <Layout>
      <button onClick={() => navigate('/admin/accounts')}>Back to Admin Accounts</button>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {details && (
        <>
          <h1>Admin Account Details</h1>

          <div className="section">
            <p><strong>User Login:</strong> {details.account.user.login}</p>
            <p><strong>User Role:</strong> {details.account.user.role}</p>
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
                  <Link to={`/admin/accounts/${details.account.id}/cards/${card.id}`}>
                    {card.cardNumber} — {card.expiryDate}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Add Card</h2>

            <form onSubmit={handleAddCard}>
              <input
                type="text"
                placeholder="MM/YY"
                value={newCardExpiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^\d]/g, '');

                  if (value.length > 4) {
                    value = value.slice(0, 4);
                  }

                  if (value.length >= 3) {
                    value = `${value.slice(0, 2)}/${value.slice(2)}`;
                  }

                  setNewCardExpiryDate(value);
                }}
                maxLength={5}
                required
              />
              <button type="submit">Add Card</button>
            </form>
          </div>

          <div className="section">
            <h2>Account Status</h2>
            <button onClick={handleBlockToggle}>
              {details.account.isBlocked ? 'Unblock Account' : 'Block Account'}
            </button>
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