import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './AdminDashboard.css';
import AuthService from '../../Auth/Services/authService';

const AdminDashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [task, setTask] = useState({ title: '', description: '' });
    const [sponsorships, setSponsorships] = useState([]);
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState({
        volunteers: [],
        sponsors: [],
    });

    const applyFilter = useCallback(() => {
        const term = searchTerm.toLowerCase();
        const filterFunction = (user) =>
            user.username.toLowerCase().includes(term) ||
            (user.name && user.name.toLowerCase().includes(term));
        setFilteredUsers({
            volunteers: volunteers.filter(filterFunction),
            sponsors: sponsors.filter(filterFunction),
        });
    }, [searchTerm, volunteers, sponsors]);

    const fetchSponsorSponsorships = useCallback(async () => {
        try {
            const headers = AuthService.getAuthHeaders();
            const response = await axios.get(
                `http://localhost:8080/api/events/sponsorships/sponsor/${selectedSponsor.id}`,
                { headers }
            );
            setSponsorships(response.data);
        } catch (error) {
            console.error('Failed to fetch sponsorships:', error);
        }
    }, [selectedSponsor]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [applyFilter]);

    useEffect(() => {
        if (selectedSponsor) {
            fetchSponsorSponsorships();
        }
        setSelectedVolunteer(null);
    }, [selectedSponsor, fetchSponsorSponsorships]);

    useEffect(() => {
        setSelectedSponsor(null);
    }, [selectedVolunteer]);

    const fetchData = async () => {
        try {
            const headers = AuthService.getAuthHeaders();
            const [volunteersResponse, sponsorsResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/admin/volunteers', { headers }),
                axios.get('http://localhost:8080/api/admin/sponsors', { headers }),
            ]);
            setVolunteers(volunteersResponse.data);
            setSponsors(sponsorsResponse.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleVolunteerClick = (volunteer) => setSelectedVolunteer(volunteer);
    const handleSponsorClick = (sponsor) => setSelectedSponsor(sponsor);

    const handleAssignTask = async () => {
        if (selectedVolunteer) {
            try {
                const headers = AuthService.getAuthHeaders();
                await axios.post(
                    'http://localhost:8080/api/admin/tasks',
                    {
                        title: task.title,
                        description: task.description,
                        volunteerId: selectedVolunteer.id,
                    },
                    { headers }
                );
                setTask({ title: '', description: '' });
                fetchData();
            } catch (error) {
                console.error('Failed to assign task:', error);
            }
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const headers = AuthService.getAuthHeaders();
            await axios.post(`http://localhost:8080/api/admin/tasks/${taskId}/complete`, {}, { headers });
            fetchData();
        } catch (error) {
            console.error('Failed to mark task as complete:', error);
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
            className="admin-dashboard"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} custom={0} className="dashboard-title">
                Admin Dashboard
            </motion.h1>
            <motion.input
                type="text"
                placeholder="Search for volunteers or sponsors..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                variants={itemVariants}
                custom={1}
            />
            <div className="main-content">
                <motion.section id="volunteers" variants={itemVariants} custom={2}>
                    <h2>Volunteers</h2>
                    <div className="volunteer-list">
                        {filteredUsers.volunteers.map((volunteer, index) => (
                            <VolunteerCard
                                key={volunteer.id}
                                volunteer={volunteer}
                                onClick={() => handleVolunteerClick(volunteer)}
                                isSelected={selectedVolunteer && selectedVolunteer.id === volunteer.id}
                                custom={index}
                            />
                        ))}
                    </div>
                </motion.section>

                <motion.section id="sponsors" variants={itemVariants} custom={3}>
                    <h2>Sponsors</h2>
                    <div className="sponsor-list">
                        {filteredUsers.sponsors.map((sponsor, index) => (
                            <SponsorCard
                                key={sponsor.id}
                                sponsor={sponsor}
                                onClick={() => handleSponsorClick(sponsor)}
                                custom={index}
                            />
                        ))}
                    </div>
                </motion.section>
            </div>

            {selectedVolunteer && (
                <VolunteerDetails
                    volunteer={selectedVolunteer}
                    onCompleteTask={handleCompleteTask}
                    onAssignTask={handleAssignTask}
                    task={task}
                    setTask={setTask}
                />
            )}
            {selectedSponsor && (
                <motion.div
                    className="sponsor-details-container"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={4}
                >
                    <h3>{selectedSponsor.username}'s Sponsorships</h3>
                    <ul>
                        {sponsorships.map((sponsorship, index) => (
                            <motion.li
                                key={sponsorship.eventId}
                                variants={itemVariants}
                                custom={index}
                            >
                                <p>Event ID: {sponsorship.eventId}</p>
                                <p>Amount Sponsored: ${sponsorship.amount}</p>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </motion.div>
    );
};

const VolunteerCard = ({ volunteer, onClick, isSelected, custom }) => (
    <motion.div
        className={`volunteer-card ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
        variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
        }}
        custom={custom}
        whileHover={{ scale: 1.05 }}
    >
        <h3>{volunteer.username}</h3>
    </motion.div>
);

const SponsorCard = ({ sponsor, onClick, custom }) => (
    <motion.div
        className="sponsor-card"
        onClick={onClick}
        variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
        }}
        custom={custom}
        whileHover={{ scale: 1.05 }}
    >
        <h3>{sponsor.username || sponsor.name}</h3>
    </motion.div>
);

const VolunteerDetails = ({ volunteer, onCompleteTask, onAssignTask, task, setTask }) => {
    const detailVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.4, delay: i * 0.2 },
        }),
    };

    return (
        <motion.div
            className="volunteer-details-container"
            variants={detailVariants}
            initial="hidden"
            animate="visible"
            custom={4}
        >
            <div className="volunteer-details-card">
                <motion.h3 variants={detailVariants} custom={0}>
                    {volunteer.username}'s Details
                </motion.h3>
                <motion.div className="tasks-section" variants={detailVariants} custom={1}>
                    <h4>Tasks</h4>
                    {volunteer.tasks && volunteer.tasks.length > 0 ? (
                        volunteer.tasks.map((task, index) => (
                            <motion.div
                                key={task.id}
                                className="task-item"
                                variants={detailVariants}
                                custom={index + 2}
                            >
                                <h5>{task.title}</h5>
                                <p>Description: {task.description}</p>
                                <p>Status: {task.status}</p>
                                <motion.button
                                    onClick={() => onCompleteTask(task.id)}
                                    whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Complete
                                </motion.button>
                            </motion.div>
                        ))
                    ) : (
                        <p>No tasks assigned yet.</p>
                    )}
                </motion.div>
                <motion.div className="assign-task-section" variants={detailVariants} custom={2}>
                    <h4>Assign New Task</h4>
                    <input
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        placeholder="Task Title"
                        required
                    />
                    <textarea
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        placeholder="Task Description"
                        required
                    />
                    <motion.button
                        onClick={onAssignTask}
                        whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Assign Task
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;