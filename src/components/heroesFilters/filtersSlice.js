import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

const initialState = {
    filters: [], 
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
}

export const fetchFilter = createAsyncThunk(
    'filters/fetchFilter',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/filters")
    }
);

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filtersFetching: state => {
            state.filtersLoadingStatus = 'loading'
        },
        filtersFetched: (state, action) => {
            state.filters = action.payload,
            state.filtersLoadingStatus = 'idle'
        },
        filtersFetchingError: state => {
            state.filtersLoadingStatus = 'error'
        },
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder 
            .addCase(fetchFilter.pending, state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilter.fulfilled, (state, action) => {
                state.filters = action.payload,
                state.filtersLoadingStatus = 'idle'
            })
            .addCase(fetchFilter.rejected, state => { state.filtersLoadingStatus = 'error'})
            .addDefaultCase(() => {})
    }
})

const {actions, reducer} = filtersSlice;

export default reducer;

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions;

