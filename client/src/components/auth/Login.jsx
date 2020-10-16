import React, { useState } from 'react'
import { Link } from "react-router-dom"
import {connect} from "react-redux"
import {setAlert} from "../../actions/alert"
import {loginUser} from "../../actions/auth"
import PropTypes from "prop-types"

const Login = ({ loginUser }) => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const {email, password} = formData

    const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value })

    const onSubmit = async e => {
        e.preventDefault()
        loginUser(email, password)
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
                    // minLength="6"
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

Login.propTypes = {
    loginUser: PropTypes.func.isRequired
}

export default connect(null, {loginUser})(Login)
