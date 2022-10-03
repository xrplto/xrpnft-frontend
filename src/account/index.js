import React from 'react';
import { useState } from 'react';

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fNumber } from 'src/utils/formatNumber';

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';

export default function Account({data}) {
    const [view, setView] = useState(data?.collection?.type);

    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;
    
    return (
        <>
            <Stack alignItems="center" sx={{mb: 5}}>
                <IconCover>
                    <IconWrapper>
                        <IconImage src={`https://s1.xrpnft.com/account/${logoImage}`}/>
                        {account === collection.account &&
                            <Link href={`/collection/${slug}/edit`} underline='none'>
                                <CardOverlay>
                                    <EditIcon
                                        className="MuiIconEditButton-root"
                                        // color='primary'
                                        fontSize="large"
                                        sx={{ opacity: 0, zIndex: 1 }}
                                    />
                                </CardOverlay>
                                <ImageBackdrop className="MuiImageBackdrop-root" />
                            </Link>
                        }
                    </IconWrapper>
                </IconCover>
                <Typography variant="h1a">{name}</Typography>
                {description &&
                    <Typography variant="d3" maxWidth='600px'>{description}</Typography>
                }
                {/* <Link
                    component="button"
                    underline="always"
                    variant="body2"
                    color="#33C2FF"
                    onClick={() => {
                        setView('');
                    }}
                >
                    <Typography sx={{ml:0}}>View Collection Items</Typography>
                </Link> */}
            </Stack>
        </>
    );
}
