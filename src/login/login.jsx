import React from 'react';
import '../app.css';

import { useNavigate } from 'react-router-dom';

export function Login() {
    const [isRegistering, setIsRegistering] = React.useState(false);
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    }

    const handleLogin = () => {
        // Here is the authentication logic
        navigate('/chat');
    }

    return (
        <main>
            <div className="login-page">
                <div className={`form ${isRegistering ? 'register' : 'login'}`}>
                    <form className="register-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <input type="text" placeholder="name" />
                        <input type="password" placeholder="password" />
                        <input type="text" placeholder="email address" />
                        <button type="submit">create</button>
                        <p className="message">
                            Already registered? &nbsp;
                            <a href="#" onClick={toggleForm}>Sign In</a>
                        </p>
                    </form>


                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <input type="text" placeholder="username" />
                        <input type="password" placeholder="password" />
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