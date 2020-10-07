import Footer from "./Footer";
import Header from "./Header";

const PageContainer = ({ children, page }) => (
  <div className="w-screen">
    <Header page={page} />
    <div className="container min-h-screen pt-24 -mb-24">{children}</div>
    <Footer />
  </div>
);

export default PageContainer;

