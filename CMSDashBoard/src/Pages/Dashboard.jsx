// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActions, setRecentActions] = useState([]);
  const token = localStorage.getItem("token"); // get JWT

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/dashboard/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    const fetchRecentActions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/dashboard/recent-actions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecentActions(res.data);
      } catch (err) {
        console.error("Error fetching recent actions:", err);
      }
    };

    fetchStats();
    fetchRecentActions();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Today's Bookings</p>
          <p className="text-2xl font-bold">{stats.todayBookings || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Occupancy Rate</p>
          <p className="text-2xl font-bold">{stats.occupancyRate || 0}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-2xl font-bold">${stats.revenue || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Actions</h3>
        <ul className="space-y-2">
          {recentActions.map((action) => (
            <li key={action.id} className="flex justify-between border-b py-2">
              <span>
                {action.action} by {action.user}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(action.time).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
