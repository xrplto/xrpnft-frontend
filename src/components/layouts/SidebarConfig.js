import { Icon } from '@iconify/react';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import mint from '@iconify/icons-file-icons/mint';
import spinnerIcon from '@iconify/icons-fontisto/spinner';
import progressBar from '@iconify/icons-carbon/progress-bar';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'All NFTs',
    path: '/ledger',
    icon: getIcon(mint)
  },
  {
    title: 'SiteNFTs',
    path: '/',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'Collections',
    path: '/#',
    icon: getIcon('ep:collection')
  },
  {
    title: 'NFToken Tester',
    path: '/tester',
    icon: getIcon('mdi:postage-stamp')
  },
  {
    title: 'Spinners',
    path: '/spinners',
    icon: getIcon(spinnerIcon)
  },
  {
    title: 'Progress',
    path: '/progress',
    icon: getIcon(progressBar)
  },
];

export default sidebarConfig;
