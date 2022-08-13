// Black
import { NebulaFighterTheme } from './schemes/NebulaFighterTheme';
import { DarkSpacesTheme } from './schemes/DarkSpacesTheme';
import { GreenFieldsTheme } from './schemes/GreenFieldsTheme';
// White
import { PureLightTheme } from './schemes/PureLightTheme';
import { GreyGooseTheme } from './schemes/GreyGooseTheme';
import { PurpleFlowTheme } from './schemes/PurpleFlowTheme';
// XRPL.to
import { XrplToDarkTheme } from './schemes/XrplToDarkTheme';
import { XrplToLightTheme } from './schemes/XrplToLightTheme';

const themeMap = {
    // Black
    NebulaFighterTheme,
    DarkSpacesTheme,
    GreenFieldsTheme,
    // White
    PureLightTheme,
    GreyGooseTheme,
    PurpleFlowTheme,
    // XRPL.to
    XrplToDarkTheme,
    XrplToLightTheme,
};



export function themeCreator(dark) {
    let theme;
    if (dark)
        theme = 'DarkSpacesTheme';
    else
        theme = 'PureLightTheme';
    return themeMap[theme];
}
