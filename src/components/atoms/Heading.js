import React from "react"
import { Typography } from "@mui/material"


export const Heading = ({ title }) => (
    <Typography variant="h3" gutterBottom  overflow='hidden' fontWeight={600} sx={{fontSize: '30px'}}>
        {title}
    </Typography>
)