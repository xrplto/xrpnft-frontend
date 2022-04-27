
import styled from "styled-components"
import { Button } from "@mui/material"
import { styled as muiStyled } from '@mui/material/styles';


export const StyledGrid = styled.div`
display: grid;
grid-template-columns: repeat(3, 1fr);
place-items: center;
`

export const StyledBtn = styled(Button)`
&.MuiButton-root {
  width: 180px;
  height: 40px;
  margin: 1vw;
}
`

export const DetailRow = muiStyled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
