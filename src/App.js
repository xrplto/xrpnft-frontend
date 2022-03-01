import { /*useContext, useMemo,*/ useState, useEffect } from 'react';
import Context from './Context'
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
// react loader spinner
//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
// material
import { Backdrop } from "@mui/material";
import { HashLoader } from "react-spinners";
// ----------------------------------------------------------------------

export default function App() {
    const [loading, setLoading] = useState(false);
    const key_darkmode = 'theme:isDarkMode'
    const key_profile = 'account:profile1'
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [accountProfile, setAccountProfile] = useState({payload: null, socketUrl: null, account: null});

    const toggleThisTheme = (mode) => {
        if (mode === 'isDarkMode')
            setIsDarkMode(!isDarkMode)
    }

    useEffect(() => {
        const persistIsDarkMode = localStorage.getItem(key_darkmode)

        if (persistIsDarkMode) {
            // convert to boolean
            setIsDarkMode(persistIsDarkMode === 'true')
        }
    }, [key_darkmode])

    useEffect(() => {
        const profile = localStorage.getItem(key_profile)
        if (profile)
            setAccountProfile(profile);
    }, [key_profile])

    useEffect(() => {
        try {
            localStorage.setItem(key_darkmode, isDarkMode)
        } catch (error) {
            console.warn(error)
        }
    }, [isDarkMode, key_darkmode])

    useEffect(() => {
        try {
            localStorage.setItem(key_profile, accountProfile)
        } catch (error) {
            console.warn(error)
        }
    }, [accountProfile, key_profile])

    return (
        <Context.Provider
            value={{
                isDarkMode,
                toggleThisTheme,
                accountProfile,
                setAccountProfile,
                setLoading
            }}
        >
            <Backdrop
                sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <HashLoader color={"#00AB55"} size={50} />
            </Backdrop>
            <ThemeConfig>
              <ScrollToTop />
            <GlobalStyles />
            <Router />
            </ThemeConfig>
        </Context.Provider>
    );
}
