import Footer from "./Footer";
import Header from "./Header";

const PageContainer = ({ children, page }) => (
  <div className="w-screen">
    <Header page={page} />
    <div className="containe pt-24 mb-5" style={{minHeight: "90vh"}}>{children}</div>
    <Footer />
  </div>
);

export default PageContainer;

