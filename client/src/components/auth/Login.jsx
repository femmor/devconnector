import React, { useState } from 'react'
import { Link } from "react-router-dom"

const Login = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    })

    const {name, email, password, password2} = formData

    const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value })

    const onSubmit = async e => {
        e.preventDefault()
        // Check if passwords are equal
        if (password !== password2) {
            // TODO - change this to an alert
            console.log("Passwords do not match")
        } else {
            console.log("success")
        }
    }

    return (
        <>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign in to Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" onChange={e => onChange(e)} value={email} />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={e => onChange(e)}
                    value={password}
                    minLength="6"
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account yet? <Link to="/register">Create an account</Link>
            </p>
        </>
    )
}

export default Login
