const Footer = () => {
  return (
    <footer className="footer-area">
      <div className="container">
        <div className="text text-center">
          <p>
            @ BentoFolio {new Date().getFullYear()}, Design By{" "}
            <a target="_blank" href="https://themeforest.net/user/codeefly">
              Codeefly
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
