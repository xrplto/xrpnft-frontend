import React from "react"
import { Typography } from "@mui/material"


export const Caption = ({ caption }) => (
    <Typography variant="string" fontSize={16} overflow='hidden' fontWeight={600}>
        {caption}
    </Typography>
)