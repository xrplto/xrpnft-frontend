import React from 'react';
import { useState } from 'react';

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled, useMediaQuery,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Utils
import { formatMonthYear } from 'src/utils/formatTime';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import ExploreNFT from 'src/explore';

export default function AllNFT() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    return (
        <>
            <ExploreNFT collection={null} />
        </>
    );
}
