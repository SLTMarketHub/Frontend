import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUsers, getUserById, updateUserRole, updateUserStatus, updateUserPermissions, addUser, updateUserProfile } from '../../services/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState('name-asc');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [alertMsg, setAlertMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState('Customer');
  const [editPerms, setEditPerms] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const allPermissions = ['manageUsers','manageSellers','manageProducts','viewOrders','viewReports'];
  const [searchParams, setSearchParams] = useSearchParams();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers({ page: currentPage, limit: pageSize, query, role: roleFilter, status: statusFilter, sortBy });
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, roleFilter, statusFilter, pageSize, sortBy, query]);

  // Initialize from URL params once
  useEffect(() => {
    const q = searchParams.get('q');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort');
    const size = searchParams.get('pageSize');

    if (q !== null) setQuery(q);
    if (role) setRoleFilter(role);
    if (status) setStatusFilter(status);
    if (sort) setSortBy(sort);
    if (size) setPageSize(Number(size));
    // set page to 1 on navigation
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // simple search trigger on Enter key or blur
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      loadUsers();
    }
  };

  const onPageChange = (page) => setCurrentPage(page);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Suspended': return 'failure';
      case 'Pending': return 'warning';
      default: return 'gray';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">User Management</h1>
        <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" onClick={() => setOpenAddModal(true)}>Add New User</button>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">Search</label>
            <input id="search" type="text" className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search by name or email..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearchKeyDown} />
          </div>
          <div className="flex gap-3">
            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">Role</label>
              <select id="role" className="rounded-md border px-3 py-2" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
                <option>All</option>
                <option>Customer</option>
                <option>Seller</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select id="status" className="rounded-md border px-3 py-2" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option>All</option>
                <option>Active</option>
                <option>Suspended</option>
                <option>Pending</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="mb-1 block text-sm font-medium text-gray-700">Sort</label>
              <select id="sort" className="rounded-md border px-3 py-2" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                <option value="name-asc">Name A→Z</option>
                <option value="name-desc">Name Z→A</option>
                <option value="joined-desc">Joined Newest</option>
                <option value="joined-asc">Joined Oldest</option>
              </select>
            </div>
            <div>
              <label htmlFor="pageSize" className="mb-1 block text-sm font-medium text-gray-700">Per page</label>
              <select id="pageSize" className="rounded-md border px-3 py-2" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="self-end">
              <button className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" onClick={() => {
                setCurrentPage(1);
                const params = new URLSearchParams();
                if (query) params.set('q', query);
                if (roleFilter && roleFilter !== 'All') params.set('role', roleFilter);
                if (statusFilter && statusFilter !== 'All') params.set('status', statusFilter);
                if (sortBy) params.set('sort', sortBy);
                if (pageSize) params.set('pageSize', String(pageSize));
                setSearchParams(params);
                loadUsers();
              }}>Search</button>
            </div>
          </div>
        </div>

        {alertMsg && (
          <div className="mb-3 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 flex items-start justify-between gap-4">
            <span>{alertMsg}</span>
            <button className="text-green-700/70 hover:text-green-900" onClick={() => setAlertMsg('')}>✕</button>
          </div>
        )}

        {/* Toast (top-right) */}
        {toastMsg && (
          <div className="fixed right-4 top-4 z-50 rounded-md bg-gray-800 px-4 py-2 text-sm text-white shadow-lg">
            {toastMsg}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10 text-gray-600">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Joined</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : user.status === 'Suspended' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3">{user.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50" onClick={async () => {
                          const details = await getUserById(user.id);
                          setSelectedUser(details);
                          setEditRole(details.role);
                          setEditPerms(details.permissions || []);
                          setOpenModal(true);
                        }}>View / Edit</button>
                        {user.status !== 'Suspended' ? (
                          <button className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-sm text-red-700 hover:bg-red-100" onClick={async () => {
                            await updateUserStatus(user.id, 'Suspended');
                            setAlertMsg('User suspended');
                            setToastMsg('User suspended');
                            loadUsers();
                          }}>Suspend</button>
                        ) : (
                          <button className="rounded-md border border-green-300 bg-green-50 px-2 py-1 text-sm text-green-700 hover:bg-green-100" onClick={async () => {
                            await updateUserStatus(user.id, 'Active');
                            setAlertMsg('User reactivated');
                            setToastMsg('User reactivated');
                            loadUsers();
                          }}>Reactivate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button className="rounded-md border px-3 py-1 disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Prev</button>
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <button className="rounded-md border px-3 py-1 disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button aria-label="Close" className="text-gray-500 hover:text-gray-700" onClick={() => setOpenModal(false)}>✕</button>
            </div>
            <div className="p-4">
              {selectedUser && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <input className="mt-1 w-full rounded-md border px-3 py-2" value={selectedUser.phone || ''} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Address</label>
                      <input className="mt-1 w-full rounded-md border px-3 py-2" value={selectedUser.address || ''} onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="editRole" className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                    <select id="editRole" className="w-full rounded-md border px-3 py-2" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                      <option>Customer</option>
                      <option>Seller</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">Permissions</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {allPermissions.map((perm) => (
                        <label key={perm} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={editPerms.includes(perm)}
                            onChange={(e) => {
                              if (e.target.checked) setEditPerms((p) => [...p, perm]);
                              else setEditPerms((p) => p.filter((x) => x !== perm));
                            }}
                          />
                          <span>{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
              <button className="rounded-md border px-3 py-2 hover:bg-gray-50" onClick={() => setOpenModal(false)}>Cancel</button>
              <button className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" onClick={async () => {
                if (!selectedUser) return;
                await updateUserRole(selectedUser.id, editRole);
                await updateUserPermissions(selectedUser.id, editPerms);
                await updateUserProfile(selectedUser.id, { phone: selectedUser.phone || '', address: selectedUser.address || '' });
                setAlertMsg('Role updated');
                setToastMsg('User updated');
                setOpenModal(false);
                loadUsers();
              }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {openAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <AddUserModal
            onClose={() => setOpenAddModal(false)}
            onCreated={(u) => {
              setToastMsg(`User ${u.name} created`);
              setOpenAddModal(false);
              setCurrentPage(1);
              loadUsers();
            }}
          />
        </div>
      )}
    </div>
  );
};

// Add User modal component (inline)
const AddUserModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ name: '', email: '', role: 'Customer', status: 'Active', phone: '', address: '' });
  const [perms, setPerms] = useState([]);
  const allPermissions = ['manageUsers','manageSellers','manageProducts','viewOrders','viewReports'];

  return (
    <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-lg font-semibold">Add New User</h3>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
      </div>
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input className="w-full rounded-md border px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input className="w-full rounded-md border px-3 py-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select className="w-full rounded-md border px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option>Customer</option>
              <option>Seller</option>
              <option>Admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select className="w-full rounded-md border px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
            <input className="w-full rounded-md border px-3 py-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
            <input className="w-full rounded-md border px-3 py-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-gray-700">Permissions</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {allPermissions.map((perm) => (
              <label key={perm} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={perms.includes(perm)} onChange={(e) => {
                  if (e.target.checked) setPerms((p) => [...p, perm]); else setPerms((p) => p.filter((x) => x !== perm));
                }} />
                <span>{perm}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
        <button className="rounded-md border px-3 py-2 hover:bg-gray-50" onClick={onClose}>Cancel</button>
        <button className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" onClick={async () => {
          const created = await addUser({ ...form, permissions: perms });
          onCreated(created);
        }}>Create</button>
      </div>
    </div>
  );
};

export default UserManagement;


