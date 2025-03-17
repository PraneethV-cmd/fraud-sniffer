import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

function Login() {
    const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [registerMessage, setRegisterMessage] = useState("");
    const [loginMessage, setLoginMessage] = useState("");

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    function SwitchContent() {
        const content = document.getElementById('content');
        content.classList.toggle('active');
        setRegisterMessage("");
        setLoginMessage("");
    }

    const handleChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === "register") {
            setRegisterData({ ...registerData, [name]: value });
        } else {
            setLoginData({ ...loginData, [name]: value });
        }
    };

    const validateRegister = () => {
        let newErrors = {};
        const { name, email, password } = registerData;

        if (!name.trim()) newErrors.name = "Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!isValidEmail(email)) newErrors.email = "Invalid email format";

        if (!password.trim()) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateLogin = () => {
        let newErrors = {};
        const { email, password } = loginData;

        if (!email.trim()) newErrors.loginEmail = "Email is required";
        else if (!isValidEmail(email)) newErrors.loginEmail = "Invalid email format";

        if (!password.trim()) newErrors.loginPassword = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!validateRegister()) return;

        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();
            if (response.ok) {
                setRegisterMessage("User successfully registered! You can now login.");
                setRegisterData({ name: "", email: "", password: "" });
            } else {
                setRegisterMessage(data.message);
            }
        } catch (error) {
            setRegisterMessage("Error connecting to the server");
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLogin()) return;

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();
            if (response.ok) {
                setLoginMessage("Login successful! Redirecting...");
                localStorage.setItem("token", data.token);
                window.location.href = "/";
            } else {
                setLoginMessage(data.message || "Invalid email or password");
            }
        } catch (error) {
            setLoginMessage("Error connecting to the server");
        }
    };

    return (
        <div className='content justify-content-center align-items-center d-flex shadow-lg' id='content'>
            {/* Registration Form */}
            <div className='col-md-6 d-flex justify-content-center'>
                <form id='register-form' onSubmit={handleRegisterSubmit}>
                    <div className='header-text mb-4'>
                        <h1>Create Account</h1>
                    </div>

                    <div className='input-group mb-3'>
                        <label htmlFor="register-name" className="visually-hidden">Name</label>
                        <input 
                            type='text' 
                            id="register-name"
                            name="name" 
                            placeholder='Name' 
                            className='form-control form-control-lg bg-light fs-6' 
                            value={registerData.name} 
                            onChange={(e) => handleChange(e, "register")} 
                            autoComplete="name"
                        />
                    </div>
                    {errors.name && <p className="text-danger">{errors.name}</p>}

                    <div className='input-group mb-3'>
                        <label htmlFor="register-email" className="visually-hidden">Email</label>
                        <input 
                            type='email' 
                            id="register-email"
                            name="email" 
                            placeholder='Email' 
                            className='form-control form-control-lg bg-light fs-6' 
                            value={registerData.email} 
                            onChange={(e) => handleChange(e, "register")} 
                            autoComplete="email"
                        />
                    </div>
                    {errors.email && <p className="text-danger">{errors.email}</p>}

                    <div className='input-group mb-3'>
                        <label htmlFor="register-password" className="visually-hidden">Password</label>
                        <input 
                            type='password' 
                            id="register-password"
                            name="password" 
                            placeholder='Password' 
                            className='form-control form-control-lg bg-light fs-6' 
                            value={registerData.password} 
                            onChange={(e) => handleChange(e, "register")} 
                            autoComplete="new-password"
                        />
                    </div>
                    {errors.password && <p className="text-danger">{errors.password}</p>}

                    <div className='input-group mb-3 justify-content-center'>
                        <button type="submit" className='btn border-white text-white w-50 fs-6'>Register</button>
                    </div>
                    {/* Message Display for Registration */}
                    {registerMessage && <p className="text-center mt-3">{registerMessage}</p>}
                </form>
            </div>

            {/* Login Form */}
            <div className='col-md-6 right-box'>
                <form id='login-form' onSubmit={handleLoginSubmit}>
                    <div className='header-text mb-4'>
                        <h1>Sign In</h1>
                    </div>

                    <div className='input-group mb-3'>
                        <label htmlFor="login-email" className="visually-hidden">Email</label>
                        <input 
                            type='email' 
                            id="login-email"
                            name="email" 
                            placeholder='Email' 
                            className='form-control form-control-lg bg-light fs-6' 
                            value={loginData.email} 
                            onChange={(e) => handleChange(e, "login")} 
                            autoComplete="email"
                        />
                    </div>
                    {errors.loginEmail && <p className="text-danger">{errors.loginEmail}</p>}

                    <div className='input-group mb-3'>
                        <label htmlFor="login-password" className="visually-hidden">Password</label>
                        <input 
                            type='password' 
                            id="login-password"
                            name="password" 
                            placeholder='Password' 
                            className='form-control form-control-lg bg-light fs-6' 
                            value={loginData.password} 
                            onChange={(e) => handleChange(e, "login")} 
                            autoComplete="current-password"
                        />
                    </div>
                    {errors.loginPassword && <p className="text-danger">{errors.loginPassword}</p>}

                    <div className='input-group mb-5 d-flex justify-content-between'>
                        <div className='form-check'>
                            <input type='checkbox' id="remember-me" className='form-check-input' />
                            <label htmlFor='remember-me' className='form-check-label text-secondary'><small>Remember me</small></label>
                        </div>
                        <div className='forgot'>
                            <small><a href='/forgot-password'>Forgot password</a></small>
                        </div>
                    </div>

                    <div className='input-group mb-3 justify-content-center'>
                        <button type="submit" className='btn border-white text-white w-50 fs-6'>Login</button>
                    </div>
                    {/* Message Display for Login */}
                    {loginMessage && <p className="text-center mt-3">{loginMessage}</p>}
                </form>
            </div>

            {/* Switch Panel */}
            <div className='switch-content'>
                <div className='switch'>
                    <div className='switch-panel switch-left'>
                        <h1>Hello, Again</h1>
                        <p>We are happy to see you back</p>
                        <button className='hidden btn text-white w-50 fs-6' id='login' onClick={SwitchContent}>Login</button>
                    </div>

                    <div className='switch-panel switch-right'>
                        <h1>Welcome</h1>
                        <p>Join Our Unique Platform, Explore a New Experience</p>
                        <button className='hidden btn border-white text-white w-50 fs-6' id='register' onClick={SwitchContent}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;