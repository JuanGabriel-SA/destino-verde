export function setUser (payload) {
    return {
        type: 'SET_USER',
        payload: payload
    }
}

export function newUser (payload) {
    return {
        type: 'NEW_USER',
        payload: payload
    }
}

export function editUser (payload) {
    return {
        type: 'EDIT_USER',
        payload: payload
    }
}

export function deleteUser (payload) {
    return {
        type: 'DELETE_USER',
        payload: payload
    }
}

export function confirmUser (payload) {
    return {
        type: 'CONFIRM_USER',
        payload: payload
    }
}