import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/config';


function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${config.active.apiUrl}/api/credits/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transactions">
      <h2>Transaction History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Credits</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id}>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td>{tx.planId}</td>
                <td>₹{tx.amount/100}</td>
                <td>{tx.credits}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionHistory; 