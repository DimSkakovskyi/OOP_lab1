import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getAccountDetailsRequest, blockAccountRequest } from '../api/accountApi';
import { createPaymentRequest, createTopUpRequest } from '../api/paymentApi';
import type { AccountDetails } from '../types/account';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function AccountDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const accountId = Number(id);

  const [details, setDetails] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    description: '',
  });

  const [topupForm, setTopupForm] = useState({
    amount: '',
    description: '',
  });

  const loadDetails = useCallback(async () => {
    try {
      if (Number.isNaN(accountId)) {
        setError('Invalid account ID');
        return;
      }

      setLoading(true);
      const data = await getAccountDetailsRequest(accountId);
      setDetails(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load account details'));
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await createPaymentRequest(
        accountId,
        Number(paymentForm.amount),
        paymentForm.description
      );
      setPaymentForm({ amount: '', description: '' });
      await loadDetails();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Payment failed'));
    }
  }

  async function handleTopUpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await createTopUpRequest(
        accountId,
        Number(topupForm.amount),
        topupForm.description
      );
      setTopupForm({ amount: '', description: '' });
      await loadDetails();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Top up failed'));
    }
  }

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
                  {card.cardNumber} — {card.expiryDate}
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Make Payment</h2>
            <form onSubmit={handlePaymentSubmit}>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amount: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={paymentForm.description}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, description: e.target.value })
                }
              />
              <button type="submit">Pay</button>
            </form>
          </div>

          <div className="section">
            <h2>Top Up Account</h2>
            <form onSubmit={handleTopUpSubmit}>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount"
                value={topupForm.amount}
                onChange={(e) =>
                  setTopupForm({ ...topupForm, amount: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={topupForm.description}
                onChange={(e) =>
                  setTopupForm({ ...topupForm, description: e.target.value })
                }
              />
              <button type="submit">Top Up</button>
            </form>
          </div>

          <div className="section">
            <h2>Block Account</h2>
            <button onClick={handleBlock}>Block Account</button>
          </div>

          <div className="section">
            <h2>Payment History</h2>
            <ul>
              {details.payments.map((payment) => (
                <li key={payment.id}>
                  {payment.type} — {payment.amount} — {payment.description} — {payment.createdAt}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Layout>
  );
}