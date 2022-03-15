import { Icon } from '@iconify/react';
import roundTransferWithinAStation from '@iconify/icons-ic/round-transfer-within-a-station';
import feedburnerIcon from '@iconify/icons-ps/feedburner';
import xrpIcon from '@iconify/icons-cryptocurrency/xrp';
import workspaceTrusted from '@iconify/icons-codicon/workspace-trusted';

export const IconBurnable = () => (
    <Icon icon={feedburnerIcon}  />
)
export const IconOnlyXRP = () => (
    <Icon icon={xrpIcon} />
)
export const IconTrustline = () => (
    <Icon icon={workspaceTrusted}  />
)
export const IconTransferable = () => (
    <Icon icon={roundTransferWithinAStation} />
)