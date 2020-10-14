import {SET_ALERT, REMOVE_ALERT} from "../actions/types"

// Function that takes in a state, initial empty array
const initialState = []

export default function(state = initialState, action) {
    // Destructure the action
    const {type, payload} = action

    // evaluate the action type - with case statement
    switch (type) {
        case SET_ALERT:
            return [...state, payload]
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload)
        default:
            return state
    }
}