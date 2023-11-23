export default function (state = null, action) {
    switch (action.type) {
        case 'NEW_USER':
            return action.payload;
        case 'SET_USER':
            return action.payload;
        case 'DELETE_USER':
            return state.filter(({ id }) => id !== action.payload)
        case 'EDIT_USER':
            let newContent = action.payload;
            let newState = [...state];
            for (let i = 0; i < newState.length; i++) {
                if (newState[i].id == newContent.id) {
                    newState[i] = { ...newContent };
                }
            }
            return newState;
        default:
            return state;
    }
}