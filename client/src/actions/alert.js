import {v4 as uuid} from "uuid"
import {SET_ALERT, REMOVE_ALERT} from "./types"

//  setAlert function   
// dispatches the type of SET_ALERT to the reducer and add the alert to the state
export const setAlert = (msg, alertType) => dispatch => {
    const id = uuid()
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    })

    setTimeout(() => {
        dispatch({
            type: REMOVE_ALERT,
            payload: id
        })
    }, 5000);
}