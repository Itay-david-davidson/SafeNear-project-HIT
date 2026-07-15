import React, { useState, useEffect } from 'react';

function Dashboard({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [shelters, setShelters] = useState([]);
  const [maps, setMaps] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal States
  const [showShelterModal, setShowShelterModal] = useState(false);
  const [editingShelter, setEditingShelter] = useState(null);
  const [shelterForm, setShelterForm] = useState({ name: '', open: false, location: '', mapID: '' });

  const [showMapModal, setShowMapModal] = useState(false);
  const [editingMap, setEditingMap] = useState(null);
  const [mapForm, setMapForm] = useState({ name: '', path: '' });

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ username: '', password: '', admin: false });

  const isAdmin = user && (user.admin === 1 || user.admin === true);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Shelters (Public)
      const resShelters = await fetch('/api/shelters');
      if (!resShelters.ok) throw new Error('Failed to load shelters');
      const dataShelters = await resShelters.json();
      setShelters(dataShelters);

      // Fetch Maps (Public)
      const resMaps = await fetch('/api/maps');
      if (!resMaps.ok) throw new Error('Failed to load maps');
      const dataMaps = await resMaps.json();
      setMaps(dataMaps);

      // Fetch Users (Requires Admin)
      if (isAdmin) {
        const resUsers = await fetch('/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resUsers.ok) {
          const dataUsers = await resUsers.json();
          setUsers(dataUsers);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  // --- Shelter Handlers ---
  const handleShelterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const method = editingShelter ? 'PUT' : 'POST';
    const url = editingShelter ? `/api/shelters/${editingShelter.id}` : '/api/shelters';
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: shelterForm.name,
          open: shelterForm.open ? 1 : 0,
          location: shelterForm.location,
          mapID: parseInt(shelterForm.mapID, 10)
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Operation failed');

      showNotification(editingShelter ? 'Shelter updated successfully!' : 'Shelter added successfully!');
      setShowShelterModal(false);
      setEditingShelter(null);
      setShelterForm({ name: '', open: false, location: '', mapID: '' });
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleToggleShelterStatus = async (shelter) => {
    if (!isAdmin) return;
    try {
      const response = await fetch(`/api/shelters/${shelter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: shelter.name,
          open: shelter.open ? 0 : 1, // Toggle
          location: shelter.location,
          mapID: shelter.map_id
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to toggle status');

      showNotification(`Shelter "${shelter.name}" is now ${shelter.open ? 'Closed' : 'Open'}.`);
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleEditShelterClick = (shelter) => {
    setEditingShelter(shelter);
    setShelterForm({
      name: shelter.name,
      open: shelter.open === 1 || shelter.open === true,
      location: shelter.location,
      mapID: shelter.map_id || ''
    });
    setShowShelterModal(true);
  };

  const handleDeleteShelter = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shelter?')) return;
    try {
      const response = await fetch(`/api/shelters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');
      showNotification('Shelter deleted successfully.');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- Map Handlers ---
  const handleMapSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const method = editingMap ? 'PUT' : 'POST';
    const url = editingMap ? `/api/maps/${editingMap.id}` : '/api/maps';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: mapForm.name,
          path: mapForm.path
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Operation failed');

      showNotification(editingMap ? 'Map updated successfully!' : 'Map added successfully!');
      setShowMapModal(false);
      setEditingMap(null);
      setMapForm({ name: '', path: '' });
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleEditMapClick = (map) => {
    setEditingMap(map);
    setMapForm({ name: map.name, path: map.path });
    setShowMapModal(true);
  };

  const handleDeleteMap = async (id) => {
    if (!window.confirm('Are you sure you want to delete this map? This may cause shelter database foreign key constraints errors if shelters reference this map.')) return;
    try {
      const response = await fetch(`/api/maps/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');
      showNotification('Map deleted successfully.');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- User Handlers ---
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `/users/${editingUser.id}` : '/users';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: userForm.username,
          password: userForm.password,
          admin: userForm.admin ? 1 : 0
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Operation failed');

      showNotification(editingUser ? 'User updated successfully!' : 'User registered successfully!');
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ username: '', password: '', admin: false });
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleEditUserClick = (targetUser) => {
    setEditingUser(targetUser);
    setUserForm({
      username: targetUser.username,
      password: '', // keep blank for security/optional update
      admin: targetUser.admin === 1 || targetUser.admin === true
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (id === user.id) {
      showNotification("You cannot delete your own account.", true);
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');
      showNotification('User deleted successfully.');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // Helper mapping functions
  const getMapName = (mapId) => {
    const map = maps.find(m => m.id === mapId);
    return map ? map.name : `Unknown Map (ID: ${mapId})`;
  };

  // Calculate Overview Stats
  const totalShelters = shelters.length;
  const openShelters = shelters.filter(s => s.open === 1 || s.open === true).length;
  const closedShelters = totalShelters - openShelters;
  const totalMaps = maps.length;
  const totalUsers = users.length;

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">🛡️</span>
          <h2>SafeNear</h2>
        </div>
        <div className="user-profile">
          <div className="avatar">👤</div>
          <div className="user-details">
            <h3 className="username">{user?.username}</h3>
            <span className="role">{isAdmin ? 'Administrator' : 'Standard User'}</span>
          </div>
        </div>
        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`menu-item ${activeTab === 'shelters' ? 'active' : ''}`}
            onClick={() => setActiveTab('shelters')}
          >
            🏠 Shelters
          </button>
          <button 
            className={`menu-item ${activeTab === 'maps' ? 'active' : ''}`}
            onClick={() => setActiveTab('maps')}
          >
            🗺️ Maps
          </button>
          {isAdmin && (
            <button 
              className={`menu-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 User Management
            </button>
          )}
        </nav>
        <button className="logout-btn" onClick={onLogout}>
          🚪 Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        {/* Status Alerts */}
        {error && (
          <div className="alert alert-danger">
            <span className="alert-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <p>{successMsg}</p>
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="tab-pane">
            <header className="content-header">
              <h1>Dashboard Overview</h1>
              <p>Real-time statistics of shelters and structural maps.</p>
            </header>

            <div className="stats-grid">
              <div className="stat-card accent-blue">
                <div className="stat-icon">🏠</div>
                <div className="stat-info">
                  <h3>Total Shelters</h3>
                  <span className="stat-value">{totalShelters}</span>
                </div>
              </div>
              <div className="stat-card accent-green">
                <div className="stat-icon">🟢</div>
                <div className="stat-info">
                  <h3>Open Shelters</h3>
                  <span className="stat-value">{openShelters}</span>
                </div>
              </div>
              <div className="stat-card accent-red">
                <div className="stat-icon">🔴</div>
                <div className="stat-info">
                  <h3>Closed Shelters</h3>
                  <span className="stat-value">{closedShelters}</span>
                </div>
              </div>
              <div className="stat-card accent-purple">
                <div className="stat-icon">🗺️</div>
                <div className="stat-info">
                  <h3>Total Maps</h3>
                  <span className="stat-value">{totalMaps}</span>
                </div>
              </div>
            </div>

            <section className="dashboard-recent">
              <div className="card">
                <h2>Quick Overview</h2>
                <div className="overview-summary">
                  <p>Welcome back, <strong>{user?.username}</strong>. You are currently operating as a <strong>{isAdmin ? 'Administrator' : 'Standard User'}</strong>.</p>
                  <p>As an admin, you have permission to add, edit, and delete shelters or map configurations, as well as register new administrators. Standard users can monitor shelter availability and view layout files.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Shelters Management */}
        {activeTab === 'shelters' && (
          <div className="tab-pane">
            <header className="content-header search-header">
              <div>
                <h1>Shelters Directory</h1>
                <p>Monitor shelter availability and locations.</p>
              </div>
              {isAdmin && (
                <button className="btn btn-primary" onClick={() => {
                  setEditingShelter(null);
                  setShelterForm({ name: '', open: false, location: '', mapID: maps[0]?.id || '' });
                  setShowShelterModal(true);
                }}>
                  ➕ Add New Shelter
                </button>
              )}
            </header>

            <div className="card">
              {loading && <p>Loading shelters...</p>}
              {!loading && shelters.length === 0 && <p className="empty-text">No shelters found.</p>}
              {!loading && shelters.length > 0 && (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Associated Map</th>
                        {isAdmin && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {shelters.map((shelter) => (
                        <tr key={shelter.id}>
                          <td>{shelter.id}</td>
                          <td className="bold">{shelter.name}</td>
                          <td>
                            <span 
                              className={`status-badge ${shelter.open === 1 || shelter.open === true ? 'status-open' : 'status-closed'} ${isAdmin ? 'interactive' : ''}`}
                              onClick={() => handleToggleShelterStatus(shelter)}
                              title={isAdmin ? "Click to toggle availability status" : ""}
                            >
                              {shelter.open === 1 || shelter.open === true ? '🟢 Open' : '🔴 Closed'}
                            </span>
                          </td>
                          <td>{shelter.location}</td>
                          <td>
                            <span className="map-badge">
                              🗺️ {getMapName(shelter.map_id)}
                            </span>
                          </td>
                          {isAdmin && (
                            <td>
                              <div className="action-buttons">
                                <button className="btn-icon-edit" onClick={() => handleEditShelterClick(shelter)}>✏️ Edit</button>
                                <button className="btn-icon-delete" onClick={() => handleDeleteShelter(shelter.id)}>🗑️ Delete</button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Maps Management */}
        {activeTab === 'maps' && (
          <div className="tab-pane">
            <header className="content-header search-header">
              <div>
                <h1>Structural Layout Maps</h1>
                <p>Manage and view layout drawings for safe locations.</p>
              </div>
              {isAdmin && (
                <button className="btn btn-primary" onClick={() => {
                  setEditingMap(null);
                  setMapForm({ name: '', path: '' });
                  setShowMapModal(true);
                }}>
                  ➕ Add New Map
                </button>
              )}
            </header>

            <div className="maps-grid">
              {maps.map((map) => (
                <div key={map.id} className="map-card">
                  <div className="map-preview">
                    <span className="map-placeholder-icon">🗺️</span>
                    <span className="map-filename">{map.path}</span>
                  </div>
                  <div className="map-info">
                    <h3>{map.name}</h3>
                    <p>Map ID: {map.id}</p>
                    {isAdmin && (
                      <div className="map-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditMapClick(map)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMap(map.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {maps.length === 0 && <p className="empty-text">No layout maps available.</p>}
            </div>
          </div>
        )}

        {/* Tab 4: Users Management */}
        {activeTab === 'users' && isAdmin && (
          <div className="tab-pane">
            <header className="content-header search-header">
              <div>
                <h1>User Administration</h1>
                <p>Register new users and manage permission policies.</p>
              </div>
              <button className="btn btn-primary" onClick={() => {
                setEditingUser(null);
                setUserForm({ username: '', password: '', admin: false });
                setShowUserModal(true);
              }}>
                ➕ Register New User
              </button>
            </header>

            <div className="card">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Permissions</th>
                      <th>Registered On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((targetUser) => (
                      <tr key={targetUser.id}>
                        <td>{targetUser.id}</td>
                        <td className="bold">{targetUser.username}</td>
                        <td>
                          <span className={`role-badge ${targetUser.admin === 1 || targetUser.admin === true ? 'role-admin' : 'role-user'}`}>
                            {targetUser.admin === 1 || targetUser.admin === true ? '👑 Admin' : '👤 User'}
                          </span>
                        </td>
                        <td>{targetUser.created_at ? new Date(targetUser.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon-edit" onClick={() => handleEditUserClick(targetUser)}>✏️ Edit</button>
                            {targetUser.id !== user.id && (
                              <button className="btn-icon-delete" onClick={() => handleDeleteUser(targetUser.id)}>🗑️ Delete</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL DIALOGS --- */}

      {/* Shelter Modal */}
      {showShelterModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingShelter ? 'Edit Shelter' : 'Create Shelter'}</h2>
              <button className="close-btn" onClick={() => setShowShelterModal(false)}>✖</button>
            </div>
            <form onSubmit={handleShelterSubmit}>
              <div className="form-group">
                <label>Shelter Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Shelter Blue"
                  value={shelterForm.name}
                  onChange={e => setShelterForm({ ...shelterForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Location Info</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Block C Room 10"
                  value={shelterForm.location}
                  onChange={e => setShelterForm({ ...shelterForm, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Layout Map Reference</label>
                <select 
                  required
                  value={shelterForm.mapID}
                  onChange={e => setShelterForm({ ...shelterForm, mapID: e.target.value })}
                >
                  <option value="" disabled>-- Select layout map --</option>
                  {maps.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.path})</option>
                  ))}
                </select>
              </div>
              <div className="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="shelter-open"
                  checked={shelterForm.open}
                  onChange={e => setShelterForm({ ...shelterForm, open: e.target.checked })}
                />
                <label htmlFor="shelter-open">Mark Shelter as Open / Ready for Reception</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowShelterModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingShelter ? 'Save Changes' : 'Create Shelter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingMap ? 'Edit Map Layout' : 'Add New Map Layout'}</h2>
              <button className="close-btn" onClick={() => setShowMapModal(false)}>✖</button>
            </div>
            <form onSubmit={handleMapSubmit}>
              <div className="form-group">
                <label>Map Location Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Main Auditorium"
                  value={mapForm.name}
                  onChange={e => setMapForm({ ...mapForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Map Drawing Path / URL</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. main_auditorium_blueprint.png"
                  value={mapForm.path}
                  onChange={e => setMapForm({ ...mapForm, path: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMapModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingMap ? 'Save Layout' : 'Create Layout'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User Credentials' : 'Register New User'}</h2>
              <button className="close-btn" onClick={() => setShowUserModal(false)}>✖</button>
            </div>
            <form onSubmit={handleUserSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. sarah_connor"
                  value={userForm.username}
                  onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{editingUser ? 'Password (leave empty to keep unchanged)' : 'Password'}</label>
                <input 
                  type="password" 
                  required={!editingUser}
                  placeholder={editingUser ? '••••••••' : 'Enter strong password'}
                  value={userForm.password}
                  onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                />
              </div>
              <div className="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="user-admin"
                  checked={userForm.admin}
                  onChange={e => setUserForm({ ...userForm, admin: e.target.checked })}
                />
                <label htmlFor="user-admin">Assign Administrator Status (Full Read/Write Access)</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingUser ? 'Update User' : 'Register User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
