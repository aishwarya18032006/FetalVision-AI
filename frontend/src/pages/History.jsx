import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiTrash2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/history?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.data);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Record deleted');
      setHistory(history.filter(h => h.id !== id));
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2 className="history-title">Prediction History</h2>
      </div>

      <div className="glass-card history-card">
        <div className="history-controls">
          <div className="search-wrapper">
            <div className="search-icon">
              <FiSearch />
            </div>
            <input
              type="text"
              className="input-field search-input"
              placeholder="Search by diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Prediction</th>
                <th>Confidence</th>
                <th>Date</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="empty-row"><td colSpan="5">Loading...</td></tr>
              ) : history.length === 0 ? (
                <tr className="empty-row"><td colSpan="5">No records found.</td></tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-img-wrapper">
                        <img src={`http://localhost:5000/uploads/${item.imagePath}`} alt="" className="table-img" />
                      </div>
                    </td>
                    <td>
                      <div className="prediction-name">{item.prediction}</div>
                    </td>
                    <td>
                      <div className="confidence-wrapper">
                        <div className="confidence-bar-bg">
                          <div className="confidence-bar-fill" style={{ width: `${item.confidence}%` }}></div>
                        </div>
                        <span className="confidence-text">{item.confidence.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-text">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view">
                          <FiEye size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="action-btn delete">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
