import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    isVerified: boolean;
}

interface UserState {
    currentUser: User | null;
    error: string | null;
    loading: boolean;
}

const initialState: UserState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        pageStart: (state) => {
            state.loading = false;
            state.error = null;
            state.currentUser = null;
        },
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        }, 
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        }, 
        updateUserFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        }, 
        deleteUserFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const { pageStart, signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess} = userSlice.actions

export default userSlice.reducer