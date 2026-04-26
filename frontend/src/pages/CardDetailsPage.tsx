import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getCardDetailsRequest } from '../api/accountApi';
import { createTransferRequest } from '../api/transferApi';
import type { CardDetails } from '../types/account';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function CardDetailsPage() {
  const { accountId, cardId } = useParams();
  const navigate = useNavigate();

  const numericAccountId = Number(accountId);
  const numericCardId = Number(cardId);

  const [card, setCard] = useState<CardDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    toCardNumber: '',
    amount: '',
    description: '',
  });

  const loadCard = useCallback(async () => {
    try {
      const data = await getCardDetailsRequest(numericAccountId, numericCardId);
      setCard(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load card details'));
    } finally {
      setLoading(false);
    }
  }, [numericAccountId, numericCardId]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await createTransferRequest(
        numericCardId,
        form.toCardNumber,
        Number(form.amount),
        form.description
      );

      setForm({
        toCardNumber: '',
        amount: '',
        description: '',
      });

      await loadCard();
      navigate(`/accounts/${numericAccountId}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Transfer failed'));
    }
  }

  return (
    <Layout>
      <button onClick={() => navigate(`/accounts/${numericAccountId}`)}>
        Back to Account
      </button>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {card && (
        <>
          <h1>Card Details</h1>

          <div className="section">
            <p><strong>Card ID:</strong> {card.id}</p>
            <p><strong>Card Number:</strong> {card.cardNumber}</p>
            <p><strong>Expiry Date:</strong> {card.expiryDate}</p>
            <p><strong>Account Number:</strong> {card.account.accountNumber}</p>
            <p><strong>Account Balance:</strong> {card.account.balance}</p>
          </div>

          <div className="section">
            <h2>Transfer Money</h2>

            <form onSubmit={handleTransfer}>
              <input
                type="text"
                placeholder="Destination card number"
                value={form.toCardNumber}
                onChange={(e) =>
                  setForm({ ...form, toCardNumber: e.target.value })
                }
                required
              />

              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button type="submit">Transfer</button>
            </form>
          </div>
        </>
      )}
    </Layout>
  );
}