import { configureStore, createSlice } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';

const API = 'https://randomuser.me/api/?results=100';

const dataSlice = createSlice({
    name: "userdata",
    initialState: {
        userdata: [],
        dataPerPage: 15,
        currentPage: 1 // default page
    },
    reducers: {
        fetchAllUserData: (state, action) => {
            state.userdata = action.payload; 
        },
        onNavigateNext: (state) => {
            state.currentPage++;
        },
        onNavigatePrev: (state) => {
            state.currentPage--;
        },
        onchangedataPerPage: (state, action) => {
            state.dataPerPage = action.payload;
        },
        onClickCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    }
});

const fetchAllUserData = () => {
    return async (dispatch) => {
        const fetchUserDataAPI = async () => {
            const response = await fetch(API);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            return data.results; 
        };
        try {
            const userdata = await fetchUserDataAPI();
            dispatch(dataSlice.actions.fetchAllUserData(userdata));
        } catch (err) {
            console.log(err);
        }
    };
};

const store = configureStore({
    reducer: {
        userdataStore: dataSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export { fetchAllUserData };
export const fetchDataAction = dataSlice.actions;
export default store;
