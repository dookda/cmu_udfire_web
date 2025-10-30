import ProfileCard from "@/components/ProfileCard";
import Shape from "@/components/Shape";
import ImageView from "@/components/popup/ImageView";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import { Fragment } from "react";
const BentoFolioLayout = ({ children, homePage = false }) => {
  return (
    <Fragment>
      <ImageView />
      {/* header part start */}
      <Header />
      {/* header part end */}
      {/* main area part start */}
      <main>
        <section className={homePage ? "home-area" : "content-box-area mt-4"}>
          <div className="container">
            <div className="row g-4">
              <div className="col-xl-4">
                <ProfileCard />
              </div>
              {children}
            </div>
          </div>
        </section>
        {/* background shape area start */}
        <Shape />
        {/* background shape area end */}
      </main>
      {/* main area part end */}
      {/* footer part start */}
      <Footer />
      {/* footer part end */}
    </Fragment>
  );
};
export default BentoFolioLayout;
