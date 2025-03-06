import React, {useState} from 'react';
import axios from 'axios';
import {motion} from 'framer-motion';

const OtpConfirmation = ({email, onOtpVerified}) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-otp', {email, otp});
            onOtpVerified(response.data.token, response.data.username, response.data.role);
        } catch (error) {
            setError('Invalid OTP. Please try again.');
        }
    };

    return (
        <motion.div className="register-card" initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}}
                    transition={{duration: 0.8}}>
            <form className="register-form" onSubmit={handleSubmit}>
                <motion.h2 initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}}
                           transition={{duration: 0.8, delay: 0.4}}>
                    Verify OTP
                </motion.h2>
                <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5, delay: 0.6}}>
                    An OTP has been sent to {email}.
                </motion.p>
                <motion.input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5, delay: 0.8}}
                />
                <motion.button
                    type="submit"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5, delay: 1}}
                >
                    Verify
                </motion.button>
                {error && (
                    <motion.p className="error-message" initial={{opacity: 0}} animate={{opacity: 1}}
                              transition={{duration: 0.5, delay: 1.2}}>
                        {error}
                    </motion.p>
                )}
            </form>
        </motion.div>
    );
};

export default OtpConfirmation;