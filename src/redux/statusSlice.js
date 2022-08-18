import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

const initialState = {
    totalCount: 0,
    // IPFS
    flags: 13,
    metadata: {
        name: '',
        description: '',
        externalLink: '',
        properties: [],
        levels: [],
    },
    // Account
    account: {
        key: null,
        secret: null
    },
    login: false,
    nfts: []
}

const statusSlice = createSlice({
    name: "status",
    initialState,
    reducers: {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        update_totalCount: (state, action) => {
            const data = action.payload;
            state.totalCount = data.total;
        },
        setFlags: (state, action) => {
            state.flags = action.payload
        },
        setMetadata: (state, action) => {
            state.metadata = { ...state.metadata, ...action.payload }
        },
        updateLevel: (state, action) => {
            const { value, idx } = action.payload
            if (idx > -1)
                state.metadata.levels[idx] = { ...state.metadata.levels[idx], ...value }
        },
        updateProperty: (state, action) => {
            const { value, idx } = action.payload
            if (idx > -1)
                state.metadata.properties[idx] = { ...state.metadata.properties[idx], ...value }
        },
        resetIpfsState: () => initialState,
        doSetAccount: (state, action) => {
            state.account = { ...action.payload };
        },
        setNFTs: (state, action) => {
            state.nfts = action.payload
        },
        login: (state) => { state.login = true },
        logout: (state) => { state.login = false },
        resetAccount: () => initialState
    },
});

export const { update_totalCount } = statusSlice.actions;
export const { setMetadata, resetIpfsState, setFlags, updateLevel, updateProperty } = statusSlice.actions
export const { doSetAccount, resetAccount, login, logout, setNFTs } = statusSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectTotalCount = (state) => state.status.totalCount;

export function configureRedux(data) {
    let defaultState = initialState;
    if (data) {
        defaultState = {
            totalCount: data.total
        }
    }

    const store = configureStore({
        reducer: {
            status: statusSlice.reducer
        },
        preloadedState: {status: defaultState}
    });

    return store;
}
