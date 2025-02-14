import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return (
        <div className="body bg-dark text-light">
            <header>
                <h1 id="title">SkibidiChat</h1>
                <img src="Logo1.png" alt="SkibidiChat Logo" id="logo"></img>
            </header>

            <main className="login-page form regiser-form">
                App components here
            </main>

            <footer>
                <div class="footer-github">
                    <a href="https://github.com/WillyBoys/startup">Github Here!</a>
                </div>
            </footer>
        </div>
    );
}