import React from 'react'
import { Link } from "react-router-dom"
import {connect} from "react-redux"
import PropTypes from "prop-types"
import { logOut } from "../../actions/auth"

const Navbar = ({ auth: { isAuthenticated, loading }, logOut}) => {
    const authLinks = (
        <ul>
            <li><Link to="/profiles">
                    <i className="fas fa-user"></i>{' '}
                    <span className="hide-sm">Developers</span>
                </Link>
            </li>
            <li><Link to="/dashboard">
                    <i className="fas fa-tachometer-alt"></i>{' '}
                    <span className="hide-sm">Dashboard</span>
                </Link>
            </li>
            <li>
                <Link onClick={logOut} to="/">
                    <i className="fas fa-sign-out-alt"></i>{' '}
                    <span className="hide-sm">Log out</span> 
                </Link>
            </li>
        </ul>
    )
    const guestLinks = (
        <ul>
            <li><a href="/profiles">Developers</a></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )

    return (
        <>
            <nav className="navbar bg-dark">
                <h1>
                    <a href="/"><i className="fas fa-code"></i> DevConnector</a>
                </h1>
                {!loading && (<>{isAuthenticated ? authLinks : guestLinks}</>) }
            </nav>
        </>
    )
}

Navbar.propTypes = {
    logOut: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {logOut})(Navbar)
