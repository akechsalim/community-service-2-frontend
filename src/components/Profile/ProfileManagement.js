import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './ProfileManagement.css';
import AuthService from "../Auth/Services/authService";

const ProfileManagement = () => {
    const [user, setUser] = useState({ username: '', email: '' });
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const headers = AuthService.getAuthHeaders();
                const response = await axios.get('http://localhost:8080/api/users/me', { headers });
                setUser(response.data);
                setFormData({ username: response.data.username, email: response.data.email });
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage('Failed to load profile.');
            }
        };
        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const headers = AuthService.getAuthHeaders();
            await axios.put('http://localhost:8080/api/users/me', formData, { headers });
            setUser(formData);
            setEditMode(false);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile.');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('New password and confirmation do not match.');
            return;
        }
        try {
            const headers = AuthService.getAuthHeaders();
            await axios.put(
                'http://localhost:8080/api/users/me/password',
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                { headers }
            );
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setMessage('Password updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage('Failed to update password.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.4, delay: i * 0.2 },
        }),
    };

    return (
        <motion.div
            className="profile-management"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} custom={0}>
                Profile Management
            </motion.h1>
            {message && (
                <motion.div className="message" variants={itemVariants} custom={1}>
                    {message}
                </motion.div>
            )}
            <div className="profile-container">
                {/* Static Profile Icon */}
                <motion.div className="profile-icon" variants={itemVariants} custom={1}>
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f4c430"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </motion.div>

                {!editMode ? (
                    <motion.div className="profile-view" variants={itemVariants} custom={2}>
                        <h2>{user.username}</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        <motion.button
                            onClick={() => setEditMode(true)}
                            variants={itemVariants}
                            custom={3}
                            whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Edit Profile
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.form
                        className="profile-edit"
                        onSubmit={handleUpdateProfile}
                        variants={itemVariants}
                        custom={2}
                    >
                        <h2>Edit Profile</h2>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Username"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Save Changes
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setEditMode(false)}
                            whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                    </motion.form>
                )}
                <motion.form
                    className="password-edit"
                    onSubmit={handleUpdatePassword}
                    variants={itemVariants}
                    custom={editMode ? 3 : 2}
                >
                    <h2>Change Password</h2>
                    <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Current Password"
                        required
                    />
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New Password"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm New Password"
                        required
                    />
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Update Password
                    </motion.button>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default ProfileManagement;