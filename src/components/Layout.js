import Header from './Header';
import Footer from './Footer';
import ThemeProviderWrapper from '../theme/ThemeProvider';

const Layout = ({ children }) => {
  return (
    <ThemeProviderWrapper>
      <Header />
      <main>{children}</main>
      <Footer />
    </ThemeProviderWrapper>
  );
};

export default Layout;
