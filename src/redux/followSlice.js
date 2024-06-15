import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    following: [],
    followers: []
};

const followSlice = createSlice({
    name: 'follow',
    initialState,
    reducers: {
        addFollower: (state, action) => {
            const user = action.payload; // Assuming action.payload is an object like { id: 123, username: 'example' }
            if (!state.followers.some(follower => follower.id === user.id)) {
                state.followers.push(user);
            }
        },
        removeFollower: (state, action) => {
            const userId = action.payload;
            state.followers = state.followers.filter(follower => follower.id !== userId);
        },
        addFollowing: (state, action) => {
            const user = action.payload; // Assuming action.payload is an object like { id: 456, username: 'example2' }
            if (!state.following.some(following => following.id === user.id)) {
                state.following.push(user);
            }
        },
        removeFollowing: (state, action) => {
            const userId = action.payload;
            state.following = state.following.filter(following => following.id !== userId);
        },
        logout: () => initialState
    }
});

export const { addFollower, removeFollower, addFollowing, removeFollowing, logout } = followSlice.actions;

export default followSlice.reducer;
