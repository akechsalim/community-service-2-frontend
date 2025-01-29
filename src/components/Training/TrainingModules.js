import React from 'react';
import CreateTrainingModule from "./CreateTrainingModule";
import './TrainingModules.css'

const TrainingModules = () => {
    return (
        <div className="training-modules-page">
            <h1>Training Modules</h1>
            <CreateTrainingModule />
        </div>
    );
};

export default TrainingModules;