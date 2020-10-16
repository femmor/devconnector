import axios from "axios"
import { setAlert } from "./alert"
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from "./types"

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