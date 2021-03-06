import React, { useState } from 'react'

// Connect component to Redux
import {connect} from "react-redux"
import {setAlert} from "../../actions/alert"
import {registerUser} from "../../actions/auth"

import { Link, Redirect } from "react-router-dom"

import PropTypes from "prop-types"



const Register = ({ setAlert, registerUser, isAuthenticated }) => {

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
            setAlert("Passwords do not match", "danger")
        } else {
            registerUser({name, email, password})
        }
    }

    if (isAuthenticated) {
        return <Redirect to="/login" />
    }

    return (
        <>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" onChange={e => onChange(e)} value={email} />
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                >
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={e => onChange(e)}
                    value={password}
                    // minLength="6"
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    onChange={e => onChange(e)}
                    value={password2}
                    // minLength="6"
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {setAlert, registerUser})(Register)
