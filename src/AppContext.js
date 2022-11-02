import { useState, createContext, useEffect } from 'react';

import { Backdrop } from "@mui/material";

// Redux
import { Provider } from "react-redux";
import {configureRedux} from "src/redux/statusSlice";

// Loader
import { PuffLoader } from "react-spinners";

export const AppContext = createContext({});

export function ContextProvider({ children, data, openSnackbar }) {
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [accountProfile, _setAccountProfile] = useState(null);
    const [acceptNfts, setAcceptNfts] = useState(0);
    const [sync, setSync] = useState(0);

    const store = configureRedux(data);

    const toggleTheme = () => {
        window.localStorage.setItem('appTheme', !darkMode);
        setDarkMode(!darkMode);
    }

    useEffect(() => {
        const isDarkMode = window.localStorage.getItem('appTheme');
        if (isDarkMode) {
            // convert to boolean
            setDarkMode(isDarkMode === 'true')
        }
    }, []);

    useEffect(() => {
        const profile = window.localStorage.getItem('accountProfile20');
        if (profile) {
            try {
                _setAccountProfile(JSON.parse(profile));
            } catch (e){}
        }
    }, [])

    const setAccountProfile = (profile) => {
        window.localStorage.setItem('accountProfile20', JSON.stringify(profile));
        _setAccountProfile(profile);
    };

    return (
        <AppContext.Provider
            value={{ toggleTheme, darkMode, accountProfile, setAccountProfile, setLoading, openSnackbar, acceptNfts, setAcceptNfts, sync, setSync }}
        >
            <Backdrop
                sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <PuffLoader color={"#00AB55"} size={50} />
            </Backdrop>

            <Provider store={store}>
                {children}
            </Provider>
        </AppContext.Provider>
    );
}
