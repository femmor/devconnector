import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {Link} from "react-router-dom"
import {connect} from "react-redux"
import {getCurrentProfile, deleteAccount} from '../../actions/profile'
import DashboardActions from "./DashboardActions"
import Spinner from "../layout/Spinner"
import Experience from './Experience'
import Education from "./Education"

const Dashboard = ({ getCurrentProfile, deleteAccount, auth: {user}, profile: {profile, loading }}) => {
    useEffect(() => {
      getCurrentProfile()
    }, [getCurrentProfile])

    return (
        loading && profile === null ? <Spinner /> : <>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
            <i className="fas fa-user">Welcome, {user && user.name}</i>
            </p>
            {profile !== null ? <>
                <DashboardActions/>
                <Experience experience={profile.experience}/>
                <Education education={profile.education}/>

                <div className="my-3">
                    <button className="btn btn-danger" onClick={() => deleteAccount()}>
                        <i className="fas fa-trash"></i> Delete Profile/Account
                    </button>
                    <div className="my-1">
                        <small>Your profile will be permanently deleted and you will NO LONGER be able to use your account</small>
                    </div>
                </div>
            </> : <>
                <p>Your profile is not completely set up, please add some info</p>
                <Link className="btn btn-primary my-1" to="/create-profile">Create Profile</Link>
            </>}
        </>
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)
