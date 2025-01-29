import React, {useState} from 'react';
import axios from 'axios';
import AuthService from "../Auth/Services/authService";

const Quiz = ({moduleId}) => {
    const [quizzes, setQuizzes] = useState([]);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const authHeaders = AuthService.getAuthHeaders();
                const response = await axios.get(`http://localhost:8080/api/quizzes/module/${moduleId}`, {
                    headers: authHeaders
                });
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };
        fetchQuizzes();
    }, [moduleId]);

    const handleSubmit = async () => {
        try {
            const authHeaders = AuthService.getAuthHeaders();
            const response = await axios.post('http://localhost:8080/api/quizzes/submit', answers, {
                headers: authHeaders
            });
            if (response.data) {
                alert('Quiz submitted successfully!');
            } else {
                alert('Quiz submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    return (
        <div className="quiz">
            <h2>Quiz</h2>
            {quizzes.map(quiz => (
                <div key={quiz.id}>
                    <p>{quiz.question}</p>
                    <input
                        type="text"
                        value={answers[quiz.id] || ''}
                        onChange={(e) => setAnswers({...answers, [quiz.id]: e.target.value})}
                    />
                </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Quiz;