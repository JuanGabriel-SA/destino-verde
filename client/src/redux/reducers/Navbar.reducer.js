export default function (state = false, action) {
    switch (action.type) {
        case 'SHOW_NAVBAR':
            return action.payload;
        default:
            return state;
    }
}