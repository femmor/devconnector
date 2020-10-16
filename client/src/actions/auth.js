import axios from "axios"
import { setAlert } from "./alert"
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL } from "./types"
import setAuthToken from "../utils/setAuthToken"

// Load user data
export const loadUser = () => async dispatch => {
    // Check if there's a token and put it in the global header
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get("/api/auth")
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

// Register user action
export const registerUser = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({ name, email, password })

    try {
        // Post the register response
        const res = await axios.post("/api/users", body, config)
        // Dispatch action
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    } catch (err) {
        // Get array of errors from the api
        const errors = err.response.data.errors
        // Check if error and dispatch error message with danger alertType
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, "danger"))
            });
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }
}

// Login user action
export const loginUser = (email, password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({ email, password })

    try {
        // Post the register response
        const res = await axios.post("/api/auth", body, config)
        // Dispatch action
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
         
        dispatch(loadUser())
    } catch (err) {
        // Get array of errors from the api
        const errors = err.response.data.errors
        // Check if error and dispatch error message with danger alertType
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, "danger"))
            });
        }

        dispatch({
            type: LOGIN_FAIL
        })
    }
}


