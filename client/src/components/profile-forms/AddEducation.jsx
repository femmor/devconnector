import React, {useState} from 'react'
import {connect} from "react-redux"
import PropTypes from 'prop-types'
import {Link, withRouter} from "react-router-dom"
import {addEducation} from '../../actions/profile';

const AddEducation = ({ addEducation, history }) => {
    const [formData, setFormData] = useState({
        school: "",
        degree: "",
        fieldOfStudy: "",
        from: "",
        current: false,
        to: "",
        description: ""
    })

    const [toDateDisabled, toggleToDateDisabled] = useState(false)

    const onChange = e => {
        setFormData({ ...formData, [e.target.name] : e.target.value })
    }

    const onSubmit = e => {
        e.preventDefault()
        addEducation(formData, history)
    }

    // Destructure the formData
    const {school, degree, fieldOfStudy, from, current, to, description} = formData

    return (
        <>
            <h1 class="large text-primary">
                Add Your Education
            </h1>
            <p class="lead">
                <i class="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
                you have attended
            </p>
            <small>* = required field</small>
            <form class="form" onSubmit={e => onSubmit(e)}>
                <div class="form-group">
                <input
                    type="text"
                    placeholder="* School or Bootcamp"
                    name="school"
                    value={school}
                    required
                    onChange={e => onChange(e)}
                />
                </div>
                <div class="form-group">
                <input
                    type="text"
                    placeholder="* Degree or Certificate"
                    name="degree"
                    value={degree}
                    required
                    onChange={e => onChange(e)}
                />
                </div>
                <div class="form-group">
                    <input type="text" placeholder="Field Of Study" name="fieldOfStudy" value={fieldOfStudy} onChange={e => onChange(e)}/>
                </div>
                <div class="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" value={from} onChange={e => onChange(e)}/>
                </div>
                <div class="form-group">
                <p>
                    <input type="checkbox" name="current" value={current} checked={current} onChange={e => {
                        setFormData({ ...formData, current: !current })
                        toggleToDateDisabled(!toDateDisabled)
                    }}/> {' '}Current School or Bootcamp
                </p>
                </div>
                <div class="form-group">
                <h4>{toDateDisabled ? `Still a student at ${school}` : "To Date"}</h4>
                <input type="date" name="to" value={to} onChange={e => onChange(e)} disabled={toDateDisabled ? "disabled" : ""}/>
                </div>
                <div class="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Program Description"
                    value={description}
                    onChange={e => onChange(e)}
                ></textarea>
                </div>
                <input type="submit" class="btn btn-primary my-1" />
                <Link class="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </>
    )
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
}

export default connect(null, {addEducation})(withRouter(AddEducation))
