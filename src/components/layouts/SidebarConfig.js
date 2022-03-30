import { Icon } from '@iconify/react';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import mint from '@iconify/icons-file-icons/mint';
import spinnerIcon from '@iconify/icons-fontisto/spinner';
import progressBar from '@iconify/icons-carbon/progress-bar';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Market',
    path: '/',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'NFToken Tester',
    path: '/tester',
    icon: getIcon(mint)
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
  {
    title: 'OffPage',
    path: '/offpage',
    icon: getIcon(progressBar)
  },
];

export default sidebarConfig;
