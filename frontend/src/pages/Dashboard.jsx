import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiActivity, FiCheckCircle, FiUpload } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiClock } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    avgConfidence: 0
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/history?limit=100', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = res.data.data;
        setHistory(data.slice(0, 5)); // recent 5
        
        const todayCount = data.filter(d => new Date(d.createdAt).toDateString() === new Date().toDateString()).length;
        const avgConf = data.length ? data.reduce((acc, curr) => acc + curr.confidence, 0) / data.length : 0;
        
        setStats({
          total: res.data.total,
          today: todayCount,
          avgConfidence: avgConf.toFixed(1)
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 8 },
    { name: 'Fri', count: 12 },
    { name: 'Sat', count: 2 },
    { name: 'Sun', count: 3 },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Overview Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card primary">
          <div className="stat-card-content">
            <div>
              <p className="stat-label">Total Predictions</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-icon primary">
              <FiActivity size={24} />
            </div>
          </div>
        </div>
        
        <div className="glass-card stat-card secondary">
          <div className="stat-card-content">
            <div>
              <p className="stat-label">Today's Uploads</p>
              <p className="stat-value">{stats.today}</p>
            </div>
            <div className="stat-icon secondary">
              <FiUpload size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card stat-card success">
          <div className="stat-card-content">
            <div>
              <p className="stat-label">Avg. Confidence</p>
              <p className="stat-value">{stats.avgConfidence}%</p>
            </div>
            <div className="stat-icon success">
              <FiCheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        {/* Chart */}
        <div className="glass-card chart-section">
          <h3 className="section-title">Weekly Activity</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card recent-activity-section">
          <h3 className="section-title">Recent Predictions</h3>
          <div className="activity-list">
            {history.length > 0 ? history.map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-icon">
                  <FiClock size={20} />
                </div>
                <div className="activity-details">
                  <p className="activity-title">{item.prediction}</p>
                  <p className="activity-time">{new Date(item.createdAt).toLocaleString()}</p>
                  <div className="activity-progress-wrapper">
                    <div className="activity-progress-bar">
                      <div className="activity-progress-fill" style={{ width: `${item.confidence}%` }}></div>
                    </div>
                    <span className="activity-progress-text">{item.confidence.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="no-activity">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
