import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AuthService from "../Auth/Services/authService";
import './TrainingModuleList.css';
import {Link} from "react-router-dom";

const TrainingModuleList = () => {
    const [modules, setModules] = useState([]);
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authHeaders = AuthService.getAuthHeaders();
                const volunteerId = AuthService.getUserId();

                // Fetch modules
                const modulesResponse = await axios.get('http://localhost:8080/api/training-modules', {
                    headers: authHeaders
                });
                setModules(modulesResponse.data);

                // Fetch progress for the logged-in volunteer
                const progressResponse = await axios.get(`http://localhost:8080/api/training-progress/volunteer/${volunteerId}`, {
                    headers: authHeaders
                });
                setProgress(progressResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
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
            // Refresh progress after marking as completed
            const progressResponse = await axios.get(`http://localhost:8080/api/training-progress/volunteer/${volunteerId}`, {
                headers: authHeaders
            });
            setProgress(progressResponse.data);
        } catch (error) {
            console.error('Error marking module as completed:', error);
        }
    };

    const isModuleCompleted = (moduleId) => {
        return progress.some(p => p.module.id === moduleId && p.completed);
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
                        <h2>
                            <Link to={`/training-modules/${module.id}`}>{module.title}</Link>
                        </h2>
                        <p>{module.description}</p>
                        <button onClick={() => markAsCompleted(module.id)}>Mark as Completed</button>
                        {isModuleCompleted(module.id) ? (
                            <button onClick={() => downloadCertificate(module.id)}>Download Certificate</button>
                        ) : (
                            <p>Complete the module to download the certificate.</p>
                        )}
                    </div>
                ))
            ) : (
                <p>No training modules available.</p>
            )}
        </div>
    );
};

export default TrainingModuleList;