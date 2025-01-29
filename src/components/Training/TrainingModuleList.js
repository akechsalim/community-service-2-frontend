import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AuthService from "../Auth/Services/authService";
import './TrainingModuleList.css';

const TrainingModuleList = () => {
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const authHeaders = AuthService.getAuthHeaders();
                const response = await axios.get('http://localhost:8080/api/training-modules', {
                    headers: authHeaders
                });
                setModules(response.data);
            } catch (error) {
                console.error('Error fetching training modules:', error);
            }
        };
        fetchModules();
    }, []);

    const markAsCompleted = async (moduleId) => {
        try {
            const authHeaders = AuthService.getAuthHeaders();
            const volunteerId = AuthService.getUserId();
            await axios.post('http://localhost:8080/api/training-progress', null, {
                headers: authHeaders,
                params: { volunteerId, moduleId }
            });
            alert('Module marked as completed!');
        } catch (error) {
            console.error('Error marking module as completed:', error);
        }
    };
    const downloadCertificate = async (moduleId) => {
        try {
            const volunteerId = AuthService.getUserId();
            const response = await axios.get('http://localhost:8080/api/certificates/generate', {
                headers: AuthService.getAuthHeaders(),
                params: { volunteerId, moduleId },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'certificate.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading certificate:', error);
        }
    };

    return (
        <div className="training-module-list">
            <h1>Training Modules</h1>
            {modules.length > 0 ? (
                modules.map(module => (
                    <div key={module.id} className="module-card">
                        <h2>{module.title}</h2>
                        <p>{module.description}</p>
                        <a href={`/training-modules/${module.id}`}>View Details</a>
                        <button onClick={() => markAsCompleted(module.id)}>Mark as Completed</button>
                        <button onClick={() => downloadCertificate(module.id)}>Download Certificate</button>
                    </div>
                ))
            ) : (
                <p>No training modules available.</p>
            )}
        </div>
    );
};

export default TrainingModuleList;