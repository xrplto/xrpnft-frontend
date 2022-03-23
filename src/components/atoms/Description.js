import React from "react"
import { Typography } from "@mui/material"
import styled from "styled-components"


export const TypoDescription = ({ description }) => (
    <StyledDescription variant="string" gutterBottom overflow='hidden' >
        {description}
    </StyledDescription>
)

const StyledDescription = styled(Typography)`
font-weight: 500;
font-size: 12px;
color: rgb(138, 147, 155);
`