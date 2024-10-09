import Header from './Header';
import ThemeProviderWrapper from '../theme/ThemeProvider';

const Layout = ({ children }) => {
  return (
    <ThemeProviderWrapper header={<Header />}>
      <main>{children}</main>
    </ThemeProviderWrapper>
  );
};

export default Layout;