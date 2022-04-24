import { useState, useEffect } from 'react';
import Context from './Context'
import Router from './routes';
import ThemeConfig from './theme';

export default function App() {
    const [loading, setLoading] = useState(false);
    const key_darkmode = 'theme:isDarkMode'
    const key_profile = 'account:profile2'
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [accountProfile, setAccountProfile] = useState(null);

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
        //const profile = '{"account":"rDsRQWRTRrtzAgK8HH7rcCAZnWeCsJm28K","uuid":"4a3eb58c-aa97-4d48-9ab2-92d90df9a75f"}';
        console.log('Profile: ' + profile);
        if (profile) {
            setAccountProfile(JSON.parse(profile));
        }
    }, [key_profile])

    useEffect(() => {
        try {
            localStorage.setItem(key_darkmode, isDarkMode)
        } catch (error) {
            console.warn(error)
        }
    }, [isDarkMode, key_darkmode])

    useEffect(() => {
        console.log('Saving: ' + JSON.stringify(accountProfile));
        try {
            localStorage.setItem(key_profile, JSON.stringify(accountProfile));
        } catch (error) {
            console.warn(error);
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
            {/* <Backdrop
                sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircleLoader color={"#00AB55"} size={50} />
            </Backdrop> */}
            <ThemeConfig>
                {/* <ScrollToTop /> */}
                {/* <GlobalStyles /> */}
                <Router />
            </ThemeConfig>
        </Context.Provider>
    );
}
