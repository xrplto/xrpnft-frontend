import { Icon } from '@mui/material'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpokeIcon from '@mui/icons-material/Spoke';
// import { ReactComponent as XrpSvg } from 'assets/xrp-logo.svg'
export const IconBurnable = () => (
    <Icon>
        <LocalFireDepartmentIcon />
    </Icon>
)
export const IconOnlyXRP = () => (

    <Icon>
        <SpokeIcon />
    </Icon>
)
export const IconTrustline = () => (
    <Icon>
        <VerifiedUserIcon />
    </Icon>
)
export const IconTransferable = () => (
    <Icon>
        <TransferWithinAStationIcon />
    </Icon>
)