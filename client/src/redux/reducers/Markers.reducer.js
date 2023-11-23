export default function (state = [], action) {
    switch (action.type) {
        case 'ADD_MARKER':
            return [...state, action.payload];
        case 'RESET_MARKERS':
            return []
        default:
            return state;
    }
}