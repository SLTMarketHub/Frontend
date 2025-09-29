import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserGroup, HiOutlineShoppingCart, HiOutlineCurrencyDollar, HiOutlineTicket } from 'react-icons/hi';
import Chart from 'react-apexcharts';
import { getDashboardData, resolveAlert, dismissAlert, getAdminNotes, saveAdminNotes } from '../../services/adminService';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData({ range, startDate: startDate || undefined, endDate: endDate || undefined });
        setData(response);
        const existing = await getAdminNotes();
        setNotes(existing);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Handle error state here
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, startDate, endDate]);

  // Revenue area chart from service
  const chartOptions = {
    chart: { id: 'revenue-chart', toolbar: { show: false } },
    xaxis: { categories: data?.series?.labels || [] },
    stroke: { curve: 'smooth' },
  };
  const chartSeries = [
    { name: 'Revenue', data: data?.series?.revenue || [] },
  ];

  const getAlertBadgeColor = (level) => {
    switch (level) {
      case 'critical': return 'failure';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'gray';
    }
  };

  const growth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const exportCSV = () => {
    if (!data) return;
    const rows = [];
    rows.push(['Metric','Current','Previous','Growth%']);
    rows.push(['Total Users', data.stats.totalUsers, data.prevStats.totalUsers, growth(data.stats.totalUsers, data.prevStats.totalUsers)]);
    rows.push(['Total Sellers', data.stats.totalSellers, data.prevStats.totalSellers, growth(data.stats.totalSellers, data.prevStats.totalSellers)]);
    rows.push(['Total Orders', data.stats.totalOrders, data.prevStats.totalOrders, growth(data.stats.totalOrders, data.prevStats.totalOrders)]);
    rows.push(['Total Revenue', data.stats.totalRevenue, data.prevStats.totalRevenue, growth(data.stats.totalRevenue, data.prevStats.totalRevenue)]);
    rows.push([]);
    rows.push(['Label', 'Revenue', 'Orders', 'Cancellations']);
    (data.series.labels || []).forEach((label, i) => {
      rows.push([label, data.series.revenue[i], data.series.orders[i], data.series.cancels[i]]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const stats = [
    { key: 'totalUsers', name: 'Total Users', value: data.stats.totalUsers, prev: data.prevStats.totalUsers, icon: HiOutlineUserGroup, color: 'text-blue-500' },
    { key: 'totalSellers', name: 'Total Sellers', value: data.stats.totalSellers, prev: data.prevStats.totalSellers, icon: HiOutlineShoppingCart, color: 'text-green-500' },
    { key: 'totalOrders', name: 'Total Orders', value: data.stats.totalOrders, prev: data.prevStats.totalOrders, icon: HiOutlineTicket, color: 'text-yellow-500' },
    { key: 'totalRevenue', name: 'Total Revenue', value: data.stats.totalRevenue, prev: data.prevStats.totalRevenue, icon: HiOutlineCurrencyDollar, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome back, Admin</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your platform and track key metrics</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Range</label>
              <select className="rounded-md border px-3 py-2" value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Start</label>
              <input type="date" className="rounded-md border px-3 py-2" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">End</label>
              <input type="date" className="rounded-md border px-3 py-2" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
            </div>
            <button className="rounded-md border px-3 py-2 hover:bg-gray-50" onClick={()=>{setStartDate('');setEndDate('');}}>Clear</button>
            <button className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" onClick={exportCSV}>Export CSV</button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <button type="button" onClick={() => {
              // Drill-down: navigate to Users, optionally preset role filter
              const params = new URLSearchParams();
              if (stat.key === 'totalSellers') params.set('role', 'Seller');
              if (stat.key === 'totalUsers') params.set('role', 'All');
              navigate(`/admin/users${params.toString() ? `?${params.toString()}` : ''}`);
            }} className="text-left rounded-xl border bg-white p-4 shadow-sm transition hover:shadow">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg bg-gray-100 p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-gray-900">{Intl.NumberFormat().format(stat.value)}</p>
                    <span className={`text-xs font-medium ${growth(stat.value, stat.prev) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth(stat.value, stat.prev)}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Revenue Overview</h2>
              <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
            </div>
          </div>

          {/* Activity + Alerts */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">Recent Activity</h2>
              <ul className="divide-y divide-gray-100">
                {data.activities.map((activity) => (
                  <li key={activity.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" onClick={() => {
                        const params = new URLSearchParams({ q: activity.user });
                        navigate(`/admin/users?${params.toString()}`);
                      }}>View User</button>
                      <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Resolve Dispute</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">System Alerts</h2>
              <div className="space-y-2">
                {data.alerts.map((alert) => (
                  <div key={alert.id} className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                    alert.level === 'critical'
                      ? 'border border-red-200 bg-red-50 text-red-800'
                      : alert.level === 'warning'
                      ? 'border border-yellow-200 bg-yellow-50 text-yellow-800'
                      : 'border border-blue-200 bg-blue-50 text-blue-800'
                  }`}>
                    <span className={alert.resolved ? 'line-through opacity-70' : ''}>{alert.message}</span>
                    <div className="flex gap-2">
                      {!alert.resolved && (
                        <button className="rounded-md border px-2 py-1 text-xs hover:bg-white/50" onClick={async ()=>{ await resolveAlert(alert.id); const r = await getDashboardData({ range, startDate, endDate }); setData(r); }}>Resolve</button>
                      )}
                      <button className="rounded-md border px-2 py-1 text-xs hover:bg-white/50" onClick={async ()=>{ await dismissAlert(alert.id); const r = await getDashboardData({ range, startDate, endDate }); setData(r); }}>Dismiss</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders vs Cancellations and Distribution */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Orders vs Cancellations</h2>
            <Chart type="bar" height={320} options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: data?.series?.labels || [] },
              plotOptions: { bar: { columnWidth: '45%' } },
            }} series={[
              { name: 'Orders', data: data?.series?.orders || [] },
              { name: 'Cancellations', data: data?.series?.cancels || [] },
            ]} />
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Users Distribution</h2>
            <Chart type="donut" height={320} options={{
              labels: ['Customers','Sellers'],
              legend: { position: 'bottom' },
            }} series={[data?.distribution?.customers || 0, data?.distribution?.sellers || 0]} />
          </div>
        </div>

        {/* Quick Actions + Admin Notes */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Quick Actions</h2>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-md border px-3 py-2 hover:bg-gray-50">Add Seller</button>
              <button className="rounded-md border px-3 py-2 hover:bg-gray-50">Resolve Dispute</button>
              <button className="rounded-md border px-3 py-2 hover:bg-gray-50">View Logs</button>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Admin Notes</h2>
            <textarea className="h-28 w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Write announcements or reminders..." />
            <div className="mt-2 flex justify-end">
              <button className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" onClick={async ()=>{ await saveAdminNotes(notes); }}>Save Notes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;