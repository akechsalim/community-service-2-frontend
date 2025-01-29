import React, { useState } from 'react';
import axios from 'axios';
import AuthService from "../Auth/Services/authService";
import './CreateTrainingModule.css'

const CreateTrainingModule = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        resourceUrl: '',
        videoUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {...formData, createdBy: AuthService.getUserId(),};
            const authHeaders = AuthService.getAuthHeaders();
            const response = await axios.post('http://localhost:8080/api/training-modules', dataToSubmit,
                {headers: authHeaders });
            alert('Training module created successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error creating training module:', error);
            alert('Failed to create training module.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div>
                <label>Content:</label>
                <textarea name="content" value={formData.content} onChange={handleChange} required />
            </div>
            <div>
                <label>Resource URL:</label>
                <input type="url" name="resourceUrl" value={formData.resourceUrl} onChange={handleChange} />
            </div>
            <div>
                <label>Video URL:</label>
                <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} />
            </div>
            <button type="submit">Create Module</button>
        </form>
    );
};

export default CreateTrainingModule;