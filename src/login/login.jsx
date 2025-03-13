import React from 'react';
import '../app.css';

import { useNavigate } from 'react-router-dom';

export function Login({ setUser }) {
    // These are useState hooks
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');

    const [isRegistering, setIsRegistering] = React.useState(false);
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
        setError(''); // Clear any error messages when switching forms
    }

    const validateInputs = () => {
        if (name.length < 3 || name.length > 15) {
            setError('Username must be between 3 and 15 characters');
            return false;
        }
        if (password.length < 6 || password.length > 20) {
            setError('Password must be between 6 and 20 characters');
            return false;
        }
        if (isRegistering && !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleLogin = () => {
        // Validate inputs before proceeding
        if (!validateInputs()) return;

        // Here is the authentication logic
        console.log(name + ' is logged in');
        localStorage.setItem('username', name);
        localStorage.setItem('email', email);
        setUser(name);
        navigate('/chat', { state: { username: name } });
    }

    function nameHandler(e) {
        setName(e.target.value);
    }

    function passwordHandler(e) {
        setPassword(e.target.value);
    }

    function emailHandler(e) {
        setEmail(e.target.value);
    }

    return (
        <main>
            <div className="login-page">
                <div className={`form ${isRegistering ? 'register' : 'login'}`}>
                    <form className="register-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (3-15 chars)" maxLength="15" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (6-20 chars)" maxLength="20" />
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                        {error && <p className="error">{error}</p>}
                        <button type="submit">create</button>
                        <p className="message">
                            Already registered? &nbsp;
                            <a href="#" onClick={toggleForm}>Sign In</a>
                        </p>
                    </form>


                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" maxLength="15" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" maxLength="20" />
                        {error && <p className="error">{error}</p>}
                        <button type="submit">login</button>
                        <p className="message">
                            Not registered? &nbsp;
                            <a href="#" onClick={toggleForm}>Create an account</a>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}