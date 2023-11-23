export function addMarker (payload) {
    return {
        type: 'ADD_MARKER',
        payload: payload
    }
}

export function resetMarkers (payload) {
    return {
        type: 'RESET_MARKERS'
    }
}
