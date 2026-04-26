import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import {
  getAdminCardDetailsRequest,
  getAdminCardTransferHistoryRequest,
} from '../api/adminApi';
import type { AdminCardDetails, Payment } from '../types/account';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function AdminCardDetailsPage() {
  const { accountId, cardId } = useParams();
  const navigate = useNavigate();

  const numericAccountId = Number(accountId);
  const numericCardId = Number(cardId);

  const [card, setCard] = useState<AdminCardDetails | null>(null);
  const [history, setHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCard = useCallback(async () => {
    try {
      const [cardData, historyData] = await Promise.all([
        getAdminCardDetailsRequest(numericAccountId, numericCardId),
        getAdminCardTransferHistoryRequest(numericAccountId, numericCardId),
      ]);

      setCard(cardData);
      setHistory(historyData);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load admin card details'));
    } finally {
      setLoading(false);
    }
  }, [numericAccountId, numericCardId]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  return (
    <Layout>
      <button onClick={() => navigate(`/admin/accounts/${numericAccountId}`)}>
        Back to Account Details
      </button>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {card && (
        <>
          <h1>Admin Card Details</h1>

          <div className="section">
            <p><strong>User Login:</strong> {card.account.user.login}</p>
            <p><strong>User Role:</strong> {card.account.user.role}</p>
            <p><strong>Card ID:</strong> {card.id}</p>
            <p><strong>Card Number:</strong> {card.cardNumber}</p>
            <p><strong>Expiry Date:</strong> {card.expiryDate}</p>
            <p><strong>Account ID:</strong> {card.account.id}</p>
            <p><strong>Account Number:</strong> {card.account.accountNumber}</p>
            <p><strong>Account Balance:</strong> {card.account.balance}</p>
            <p>
              <strong>Account Status:</strong>{' '}
              <span className={card.account.isBlocked ? 'blocked' : 'active'}>
                {card.account.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </p>
          </div>

          <div className="section">
            <h2>Transfer History</h2>

            {history.length === 0 ? (
              <p>No transfers yet</p>
            ) : (
              <ul>
                {history.map((payment) => (
                  <li key={payment.id}>
                    {payment.type} — {payment.amount} — {payment.description ?? 'No description'} — {payment.createdAt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}