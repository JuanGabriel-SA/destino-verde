export default function (state = {}, action) {
    switch (action.type) {
        case 'SET_COORDINATES':
            return action.payload;
        default:
            return state;
    }
}