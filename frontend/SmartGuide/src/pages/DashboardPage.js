import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/DashboardPage.css';

const API_URL = 'http://127.0.0.1:8000/api';

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    avatar: null,
  });
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user-details/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user_data);
          setEditFormData({
            first_name: data.user_data.first_name,
            last_name: data.user_data.last_name,
            mobile_number: data.user_data.mobile_number,
            avatar: null,
          });
        } else {
          toast.error('Failed to fetch user details.');
        }
      } catch (error) {
        toast.error('Error fetching user details.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditFormData({
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      mobile_number: userData?.mobile_number || '',
      avatar: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setEditFormData((prevData) => ({
      ...prevData,
      avatar: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('first_name', editFormData.first_name);
    formData.append('last_name', editFormData.last_name);
    formData.append('mobile_number', editFormData.mobile_number);

    if (editFormData.avatar) {
      formData.append('avatar', editFormData.avatar); 
    }

    try {
      const response = await fetch(`${API_URL}/update-user-details/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user_data);
        toast.success('User details updated successfully.');
        setIsEditing(false);
      } else {
        toast.error('Failed to update user details.');
      }
    } catch (error) {
      toast.error('Error updating user details.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const username = userData.username; // Assuming userData has the username

    if (passwordData.new_password !== passwordData.confirm_password) {
        toast.error('New password and confirmation do not match.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/change-password/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...passwordData,
                username: username, // Include username in the request body
            }),
        });

        if (response.ok) {
            toast.success('Password changed successfully.');
            setPasswordModalOpen(false);
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: '',
            });
        } else {
            toast.error('Failed to change password.');
        }
    } catch (error) {
        toast.error('Error changing password.');
    }
};

const handleOpenPasswordModal = () => {
    setPasswordModalOpen(true);
};

const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
};


  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  if (!userData) {
    return <div className="container"><p>No user data available.</p></div>;
  }

  return (
    <section className="dashboard vh-100">
      <ToastContainer />
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow rounded">
              <div className="card-body">
                <div className="d-flex align-item-center">
                  <div className="avatar-container">
                    <img
                      src={`http://127.0.0.1:8000${userData.avatar}`} 
                      alt="Avatar"
                      className="avatar-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100';
                      }}
                    />
                  </div>
                  <div className="ms-3">
                    <h3 className="mb-1">{userData.username}</h3>
                  </div>
                </div>

                <hr className="my-4" />
                {isEditing ? (
                  <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
                    <div className="user-info">
                      <h5>Edit Profile</h5>
                      <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">First Name</label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          className="form-control"
                          value={editFormData.first_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          className="form-control"
                          value={editFormData.last_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="mobile_number" className="form-label">Phone Number</label>
                        <input
                          type="text"
                          id="mobile_number"
                          name="mobile_number"
                          className="form-control"
                          value={editFormData.mobile_number}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="avatar" className="form-label">Avatar</label>
                        <input
                          type="file"
                          id="avatar"
                          name="avatar"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary me-2">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancelClick}>Cancel</button>
                      </div>
                      <div className="mt-3">
                        <p className="text-muted" onClick={handleOpenPasswordModal} style={{ cursor: 'pointer' }}>
                          Change Password
                        </p>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="user-info">
                    <h5>Profile Details</h5>
                    <p><strong>First Name:</strong> {userData.first_name}</p>
                    <p><strong>Last Name:</strong> {userData.last_name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Phone Number:</strong> {userData.mobile_number}</p>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-end">
                      <button className="btn btn-primary" onClick={handleEditClick}>Edit Profile</button>
                    </div>
                  </div>
                )}

                {/* Password Modal */}
                {isPasswordModalOpen && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close" onClick={handleClosePasswordModal}>&times;</span>
                      <h5>Change Password</h5>
                      <form onSubmit={handlePasswordChange}>
                        <div className="mb-3">
                          <label htmlFor="current_password" className="form-label">Current Password</label>
                          <input
                            type="password"
                            id="current_password"
                            name="current_password"
                            className="form-control"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="new_password" className="form-label">New Password</label>
                          <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            className="form-control"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                          <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            className="form-control"
                            value={passwordData.confirm_password}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                            required
                          />
                        </div>
                        <div className="d-flex justify-content-end">
                          <button type="submit" className="btn btn-primary me-2">Change Password</button>
                          <button type="button" className="btn btn-secondary" onClick={handleClosePasswordModal}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
