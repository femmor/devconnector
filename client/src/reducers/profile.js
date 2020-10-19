// Get the profile types
import {GET_PROFILE, PROFILE_ERROR} from "../actions/types"

// Create the initialState
const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: false,
    error: {}
}

// Create reducer function
export default function(state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }            
        default:
            return state
    }
}