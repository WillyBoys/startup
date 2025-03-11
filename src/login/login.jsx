import React from 'react';
import '../app.css';

import { useNavigate } from 'react-router-dom';

export function Login({ setUser }) {
    // These are useState hooks
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');

    const [isRegistering, setIsRegistering] = React.useState(false);
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    }

    const handleLogin = () => {
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
                        <input type="text" onChange={nameHandler} placeholder="name" />
                        <input type="password" onChange={passwordHandler} placeholder="password" />
                        <input type="text" onChange={emailHandler} placeholder="email address" />
                        <button type="submit">create</button>
                        <p className="message">
                            Already registered? &nbsp;
                            <a href="#" onClick={toggleForm}>Sign In</a>
                        </p>
                    </form>


                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <input type="text" onChange={nameHandler} placeholder="username" />
                        <input type="password" onChange={passwordHandler} placeholder="password" />
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