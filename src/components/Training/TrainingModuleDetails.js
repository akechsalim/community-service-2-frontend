import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AuthService from "../Auth/Services/authService";
import {useParams} from 'react-router-dom';
import './TrainingModuleDetails.css';

const TrainingModuleDetails = () => {
    const {moduleId} = useParams();
    const [module, setModule] = useState(null);

    useEffect(() => {
        const fetchModuleDetails = async () => {
            try {
                const authHeaders = AuthService.getAuthHeaders();
                const response = await axios.get(`http://localhost:8080/api/training-modules/${moduleId}`, {
                    headers: authHeaders
                });
                setModule(response.data);
            } catch (error) {
                console.error('Error fetching module details:', error);
            }
        };
        fetchModuleDetails();
    }, [moduleId]);

    if (!module) {
        return <p>Loading...</p>;
    }

    return (
        <div className="training-module-details">
            <h1>{module.title}</h1>
            <p>{module.description}</p>
            <div className="content">
                <h2>Content</h2>
                <p>{module.content}</p>
            </div>
            {module.resourceUrl && (
                <div className="resources">
                    <h2>Resources</h2>
                    <a href={module.resourceUrl} target="_blank" rel="noopener noreferrer">Download Resource</a>
                </div>
            )}
            {module.videoUrl && (
                <div className="video">
                    <h2>Video</h2>
                    <iframe
                        width="560"
                        height="315"
                        src={module.videoUrl}
                        title="Training Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default TrainingModuleDetails;