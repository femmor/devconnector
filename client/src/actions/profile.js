import axios from "axios"
import {setAlert} from "./alert"
import {GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE} from './types';

// Get current user's profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get("/api/profile/me")
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

// Create or Update a profile - action
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        // create a config object since we are sending data
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        } 

        const res = await axios.post("/api/profile", formData, config)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(edit ? "Profile successfully updated!" : "Profile successfully created!"), "success")

        if (!edit) {
            history.push("/dashboard")
        }
        
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })

        // Get array of errors from the api
        const errors = err.response.data.errors
        // Check if error and dispatch error message with danger alertType
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, "danger"))
            });
        }
    }
}


// Add Experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        // create a config object since we are sending data
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        } 

        const res = await axios.put("/api/profile/experience", formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Experience successfully added!", "success"))

        // Redirect to dashboard
        history.push("/dashboard")
        
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })

        // Get array of errors from the api
        const errors = err.response.data.errors
        // Check if error and dispatch error message with danger alertType
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, "danger"))
            });
        }
    }
}

// Add Education
export const addEducation = (formData, history) => async dispatch => {
    try {
        // create a config object since we are sending data
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        } 

        const res = await axios.put("/api/profile/education", formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Education successfully added!", "success"))
        
        // Redirect
        history.push("/dashboard")
        
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })

        // Get array of errors from the api
        const errors = err.response.data.errors
        // Check if error and dispatch error message with danger alertType
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, "danger"))
            });
        }
    }
}