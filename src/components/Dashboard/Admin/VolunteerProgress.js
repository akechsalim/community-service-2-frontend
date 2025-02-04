import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AuthService from "../../Auth/Services/authService";
import './VolunteerProgress.css';

const VolunteerProgress = () => {
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const authHeaders = AuthService.getAuthHeaders();
                const response = await axios.get('http://localhost:8080/api/admin/dashboard/volunteer-progress', {
                    headers: authHeaders
                });
                setProgress(response.data);
            } catch (error) {
                console.error('Error fetching volunteer progress:', error);
            }
        };
        fetchProgress();
    }, []);

    return (
        <div className="volunteer-progress">
            <h1>Volunteer Progress</h1>
            {progress.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Volunteer</th>
                        <th>Module</th>
                        <th>Completed</th>
                        <th>Completion Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {progress.map(p => (
                        <tr key={p.id}>
                            <td>{p.volunteer.username}</td>
                            <td>{p.module.title}</td>
                            <td>{p.completed ? 'Yes' : 'No'}</td>
                            <td>{p.completedAt ? new Date(p.completedAt).toLocaleString() : 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No progress data available.</p>
            )}
        </div>
    );
};

export default VolunteerProgress;