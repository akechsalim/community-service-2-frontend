import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import AuthService from "../../Auth/Services/authService";

const AdminDashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [task, setTask] = useState({title: '', description: ''});
    const [sponsorships, setSponsorships] = useState([]);
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState({
        volunteers: [],
        sponsors: []
    });
    const applyFilter = useCallback(() => {
        const term = searchTerm.toLowerCase();
        const filterFunction = user =>
            user.username.toLowerCase().includes(term) ||
            (user.name && user.name.toLowerCase().includes(term));

        setFilteredUsers({
            volunteers: volunteers.filter(filterFunction),
            sponsors: sponsors.filter(filterFunction)
        });
    }, [searchTerm, volunteers, sponsors]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [ applyFilter]);

    useEffect(() => {
        if (selectedSponsor) {
            fetchSponsorSponsorships();
        }
        setSelectedVolunteer(null);
    }, [selectedSponsor, fetchSponsorSponsorships]);

    useEffect(() => {
        // Close sponsor details if volunteer details are opened
        setSelectedSponsor(null);
    }, [selectedVolunteer]);

    const fetchData = async () => {
        try {
            const headers = AuthService.getAuthHeaders();
            const [volunteersResponse, sponsorsResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/admin/volunteers', {headers}),
                axios.get('http://localhost:8080/api/admin/sponsors', {headers})
            ]);
            setVolunteers(volunteersResponse.data);
            setSponsors(sponsorsResponse.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    const fetchSponsorSponsorships = useCallback(async () => {
        try {
            const headers = AuthService.getAuthHeaders();
            const response = await axios.get(`http://localhost:8080/api/events/sponsorships/sponsor/${selectedSponsor.id}`, {headers});
            setSponsorships(response.data);
        } catch (error) {
            console.error('Failed to fetch sponsorships:', error);
        }
    }, [selectedSponsor]);


    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleVolunteerClick = (volunteer) => setSelectedVolunteer(volunteer);
    const handleSponsorClick = (sponsor) => setSelectedSponsor(sponsor);

    const handleAssignTask = async (volunteerId) => {
        if (selectedVolunteer) {
            try {
                const headers = AuthService.getAuthHeaders();
                await axios.post('http://localhost:8080/api/admin/tasks', {
                    title: task.title,
                    description: task.description,
                    volunteerId: selectedVolunteer.id
                }, {headers});
                setTask({title: '', description: ''});
                fetchData(); // Refresh volunteer list after assignment
            } catch (error) {
                console.error('Failed to assign task:', error);
            }
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const headers = AuthService.getAuthHeaders();
            await axios.post(`http://localhost:8080/api/admin/tasks/${taskId}/complete`, {}, {headers});
            fetchData(); // Refresh volunteer list after task completion
        } catch (error) {
            console.error('Failed to mark task as complete:', error);
        }
    };

    return (
        <>
            <div className="admin-dashboard">
                <input
                    type="text"
                    placeholder="Search for volunteers or sponsors..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <div className="main-content">
                    <section id="volunteers">
                        <h2>Volunteers</h2>
                        <div className="volunteer-list">
                            {filteredUsers.volunteers.map(volunteer => (
                                <VolunteerCard
                                    key={volunteer.id}
                                    volunteer={volunteer}
                                    onClick={() => handleVolunteerClick(volunteer)}
                                    isSelected={selectedVolunteer && selectedVolunteer.id === volunteer.id}
                                />
                            ))}
                        </div>
                    </section>

                    <section id="sponsors">
                        <h2>Sponsors</h2>
                        <div className="sponsor-list">
                            {filteredUsers.sponsors.map(sponsor => (
                                <SponsorCard
                                    key={sponsor.id}
                                    sponsor={sponsor}
                                    onClick={() => handleSponsorClick(sponsor)}/>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {selectedVolunteer && (
                <div className="volunteer-details-container">
                    <VolunteerDetails
                        volunteer={selectedVolunteer}
                        onCompleteTask={handleCompleteTask}
                        onAssignTask={handleAssignTask}
                        task={task}
                        setTask={setTask}
                    >
                    </VolunteerDetails>
                </div>
            )}
            {selectedSponsor && (
                <div className="sponsor-details-container">
                    <h3>{selectedSponsor.username}'s Sponsorships</h3>
                    <ul>
                        {sponsorships.map(sponsorship => (
                            <li key={sponsorship.eventId}>
                                <p>Event ID: {sponsorship.eventId}</p>
                                <p>Amount Sponsored: ${sponsorship.amount}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};


// Volunteer card component
const VolunteerCard = ({volunteer, onClick, isSelected}) => (
    <div className={`volunteer-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
        <h3>{volunteer.username}</h3>
    </div>
);

const SponsorCard = ({ sponsor, onClick }) => (
    <div className="sponsor-card" onClick={onClick}>
        <h3>{sponsor.username || sponsor.name}</h3>
    </div>
);

const VolunteerDetails = ({volunteer, onCompleteTask, onAssignTask, task, setTask, sponsorships}) => (
    <div className="volunteer-details-card">
        <h3>{volunteer.username}'s Details</h3>
        <div className="tasks-section">
            <h4>Tasks</h4>
            {volunteer.tasks && volunteer.tasks.length > 0 ? (
                volunteer.tasks.map(task => (
                    <div key={task.id} className="task-item">
                        <h5>{task.title}</h5>
                        <p>Description: {task.description}</p>
                        <p>Status: {task.status}</p>
                        <button onClick={() => onCompleteTask(task.id)}>Complete</button>
                    </div>
                ))
            ) : (
                <p>No tasks assigned yet.</p>
            )}
        </div>
        <div className="assign-task-section">
            <h4>Assign New Task</h4>
            <input
                value={task.title}
                onChange={(e) => setTask({...task, title: e.target.value})}
                placeholder="Task Title"
                required
            />
            <textarea
                value={task.description}
                onChange={(e) => setTask({...task, description: e.target.value})}
                placeholder="Task Description"
                required
            />
            <button onClick={onAssignTask}>Assign Task</button>
        </div>
        <div className="sponsorship-section">
            <h4>Sponsorships</h4>
            {sponsorships && sponsorships.length > 0 ? (
                sponsorships.filter(sp => sp.sponsorId === volunteer.id).map(sponsorship => (
                    <div key={sponsorship.sponsorshipLevel} className="sponsorship-item">
                        <p>Level: {sponsorship.sponsorshipLevel}</p>
                        <p>Amount: ${sponsorship.amount}</p>
                    </div>
                ))
            ) : (
                <p>No sponsorships recorded.</p>
            )}
        </div>
    </div>
);

export default AdminDashboard;