// Dark Mode
import { DarkSpacesTheme } from './schemes/DarkSpacesTheme';
// import { NebulaFighterTheme } from './schemes/NebulaFighterTheme';
// import { GreenFieldsTheme } from './schemes/GreenFieldsTheme';

// Light Mode
import { PureLightTheme } from './schemes/PureLightTheme';
// import { GreyGooseTheme } from './schemes/GreyGooseTheme';
// import { PurpleFlowTheme } from './schemes/PurpleFlowTheme';

const themeMap = {
    // Dark Mode
    DarkSpacesTheme,
    // NebulaFighterTheme,
    // GreenFieldsTheme,

    // Light Mode
    PureLightTheme,
    // GreyGooseTheme,
    // PurpleFlowTheme,
};



export function themeCreator(dark) {
    let theme;
    if (dark)
        theme = 'DarkSpacesTheme';
    else
        theme = 'PureLightTheme';
    return themeMap[theme];
}
