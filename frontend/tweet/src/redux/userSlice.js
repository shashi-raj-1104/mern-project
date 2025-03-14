import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        otherUsers:null,
        profile:null,
        bookmarkUpdate:null
    },
    reducers:{
        // multiple actions
        getUser:(state,action)=>{
            state.user = action.payload;
        },
        getOtherUsers:(state,action)=>{
            state.otherUsers = action.payload;
        },
        getMyProfile:(state,action)=>{
            state.profile = action.payload;
        },
        followingUpdate:(state,action)=>{
            // unfollow
            if(state.user.following.includes(action.payload)){
                state.user.following = state.user.following.filter((itemId)=>{
                    return itemId !== action.payload;
                })
            }else{
                // follow
                state.user.following.push(action.payload);
            }
        },
        bookmarkUpdate: (state, action) => {
            if (state.user) {
                const tweetId = action.payload;
                const updatedBookmarks = state.user.bookmarks.includes(tweetId)
                    ? state.user.bookmarks.filter(id => id !== tweetId) // Remove bookmark
                    : [...state.user.bookmarks, tweetId]; // Add bookmark
                
                state.user = { ...state.user, bookmarks: updatedBookmarks }; // Ensure new reference
            }
        },
    }
});
export const {getUser, getOtherUsers,getMyProfile,followingUpdate, bookmarkUpdate } = userSlice.actions;
export default userSlice.reducer;


