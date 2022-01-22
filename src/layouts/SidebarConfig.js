import { Icon } from '@iconify/react';
//import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
//import peopleFill from '@iconify/icons-eva/people-fill';
import postageStamp from '@iconify/icons-mdi/postage-stamp';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import mint from '@iconify/icons-file-icons/mint';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Market',
    path: '/market',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'Tokens',
    path: '/tokens',
    icon: getIcon(postageStamp)
  },
  {
    title: 'NFToken Tester',
    path: '/tester',
    icon: getIcon(mint)
  }
];

export default sidebarConfig;
