import React, {useState} from 'react';
import axios from "axios";
import './ContactForm.css'

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/contact', formData);
            console.log(response.data);
            alert('Thank you for your message!');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form, please try again.');
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-card">
                <form onSubmit={handleSubmit} className="contact-form">
                    <h1>Contact Us</h1>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                               required/>
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                               required/>
                    </div>
                    <div>
                        <label htmlFor="message">Message:</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange}
                                  required/>
                    </div>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;