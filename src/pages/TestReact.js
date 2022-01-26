import Page from '../components/Page';
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Grid, Link, Typography, Stack } from '@mui/material';
import {
    Audio,
    BallTriangle,
    Bars,
    Circles,
    CradleLoader,
    Grid as GridSpinner,
    Hearts,
    MutatingDots,
    Oval,
    Plane,
    Puff,
    RevolvingDot,
    Rings,
    TailSpin,
    ThreeDots,
    Triangle,
    Watch
} from  'react-loader-spinner'

export default function TestReact() {
    const theme = useTheme();
    return (
        <Page title="Test React Controls">
            <Grid container spacing={3}>            
                <Grid key={1} item xs={12} sm={6} md={3}>
                    <Card>
                        <Audio
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                            Audio
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={2} item xs={12} sm={6} md={3}>
                    <Card>
                        <BallTriangle
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        BallTriangle
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={3} item xs={12} sm={6} md={3}>
                    <Card>
                        <Bars
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        Bars
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={4} item xs={12} sm={6} md={3}>
                    <Card>
                        <Circles
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        Circles
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={5} item xs={12} sm={6} md={3}>
                    <Card>
                        <CradleLoader
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        CradleLoader
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={6} item xs={12} sm={6} md={3}>
                    <Card>
                        <GridSpinner
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        GridSpinner
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={7} item xs={12} sm={6} md={3}>
                    <Card>
                        <Hearts
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        Hearts
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={8} item xs={12} sm={6} md={3}>
                    <Card>
                        <MutatingDots
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        MutatingDots
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={9} item xs={12} sm={6} md={3}>
                    <Card>
                        <Oval
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        Oval
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={10} item xs={12} sm={6} md={3}>
                    <Card>
                        <Plane
                            heigth="20"
                            width="20"
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        Plane
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={11} item xs={12} sm={6} md={3}>
                    <Card>
                        <Puff
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        Puff
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={12} item xs={12} sm={6} md={3}>
                    <Card>
                        <RevolvingDot
                            heigth={200}
                            width={200}
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        RevolvingDot
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={13} item xs={12} sm={6} md={3}>
                    <Card>
                        <Rings
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        Rings
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={14} item xs={12} sm={6} md={3}>
                    <Card>
                        <TailSpin
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        TailSpin
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={15} item xs={12} sm={6} md={3}>
                    <Card>
                        <ThreeDots
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        ThreeDots
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={16} item xs={12} sm={6} md={3}>
                    <Card>
                        <Triangle
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        Triangle
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
                <Grid key={17} item xs={12} sm={6} md={3}>
                    <Card>
                        <Watch
                            color={theme.palette.primary.main}
                            ariaLabel='loading'
                        />
                        <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2" noWrap>
                        Watch
                        </Typography>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Page>
      );
}