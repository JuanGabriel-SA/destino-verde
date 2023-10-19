export default function (state = false, action) {
    switch (action.type) {
        case 'ACCEPT_COOKIES':
            return action.payload;
        default:
            return state;
    }
}