import WorkTogether from "@/components/WorkTogether";
import BentoFolioLayout from "@/layout/BentoFolioLayout";
const page = () => {
  return (
    <BentoFolioLayout>
      {" "}
      <div className="col-xl-8">
        <div className="card content-box-card">
          <div className="card-body portfolio-card">
            <div className="portfolio-details-area">
              <div className="main-image">
                <img
                  src="assets/img/projects/project-details-1.png"
                  alt="project-details-1"
                />
              </div>
              <div className="portfolio-details-text">
                <div className="short-info">
                  <div className="info-item">
                    <p className="subtitle">Client For:</p>
                    <h4 className="card-title">FlexiFlow</h4>
                  </div>
                  <div className="info-item">
                    <p className="subtitle">Services:</p>
                    <h4 className="card-title">
                      Product Design, and Development
                    </h4>
                    <a href="#" className="website">
                      flexiflow.com
                      <svg
                        className="arrow-up"
                        width={14}
                        height={15}
                        viewBox="0 0 14 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.91634 4.5835L4.08301 10.4168"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M4.66699 4.5835H9.91699V9.8335"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="overview">
                  <h4 className="card-title">Overview</h4>
                  <p>
                    Web design encompasses the process of creating and designing
                    websites It involves a combination of different skills and
                    disciplines to produce a visually appealing and
                    user-friendly website. Here's an overview of key aspects of
                    web design.
                  </p>
                  <p>
                    <b>Research:</b> Before starting the design, it's essential
                    to understand the target audience, their needs, and the
                    goals of the website.
                  </p>
                  <p>
                    <b>Information Architecture:</b> Organize and structure the
                    content to ensure a logical flow for users.
                  </p>
                  <p>
                    {" "}
                    <b>Wireframing and Prototyping:</b> Create skeletal outlines
                    and interactive prototypes to visualize the layout and
                    functionality.
                  </p>
                </div>
              </div>
              <div className="inner-images">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="image-item">
                      <img
                        src="assets/img/projects/project-details-2.png"
                        alt="project-details-2"
                        className="img-fluid w-100"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="image-item">
                      <img
                        src="assets/img/projects/project-details-3.png"
                        alt="project-details-3"
                        className="img-fluid w-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="more-info-block">
                <h3 className="more-info-title">Challenges</h3>
                <p>
                  Web design comes with its own set of challenges, ranging from
                  technical issues to user experience considerations. Here are
                  some common challenges faced by web designers. Web design
                  encompasses the process of creating and designing websites It
                  involves a combination of different skills and disciplines to
                  produce a visually appealing and user-friendly website. Here's
                  an overview of key aspects of web design.
                </p>
                <h5 className="more-info-subtitle">Responsive Design:</h5>
                <ul className="list-unstyled">
                  <li>
                    <b>Challenge:</b> Ensuring that a website looks and
                    functions well on various devices and screen sizes.
                  </li>
                  <li>
                    <b>Solution:</b> Use responsive design techniques, such as
                    flexible grids and media queries.
                  </li>
                </ul>
                <h5 className="more-info-subtitle">Browser Compatibility:</h5>
                <ul className="list-unstyled">
                  <li>
                    <b>Challenge:</b> Different browsers may interpret code
                    differently, leading to inconsistencies in the website's
                    appearance.
                  </li>
                  <li>
                    <b>Solution:</b> Test the website on multiple browsers and
                    use compatibility libraries or polyfills when necessary.
                  </li>
                </ul>
                <h5 className="more-info-subtitle">User Experience (UX):</h5>
                <ul className="list-unstyled">
                  <li>
                    <b>Challenge:</b> Creating a seamless and intuitive user
                    experience that keeps visitors engaged.
                  </li>
                  <li>
                    <b> Solution:</b>
                    Conduct user testing, design user-friendly interfaces, and
                    prioritize accessibility to ensure a positive user
                    experience
                  </li>
                </ul>
                <h5 className="more-info-subtitle">
                  Compliance and Accessibility:
                </h5>
                <ul className="list-unstyled">
                  <li>
                    <b>Challenge:</b> Creating a seamless and intuitive user
                    experience that keeps visitors engaged.
                  </li>
                  <li>
                    <b>Solution:</b> Conduct user testing, design user-friendly
                    interfaces, and prioritize accessibility to ensure a
                    positive user experience
                  </li>
                </ul>
                <h3 className="more-info-title">Results/Conclusion:</h3>
                <p>
                  The website design and development for FlexiFlow successfully
                  achieved its objectives, leading to increased user engagement,
                  improved conversion rates, and positive feedback from the
                  target audience. The combination of user-centric design,
                  modern visuals, and a seamless shopping experience resulted in
                  a more competitive and appealing online presence for the
                  company. Ongoing monitoring and potential iterative
                  improvements will be crucial to maintaining and enhancing.
                </p>
              </div>
              <div className="prev-and-next-btn">
                <button className="btn btn-prev">Previous</button>
                <button className="btn btn-next">Next</button>
              </div>
            </div>
            <WorkTogether />
          </div>
        </div>
      </div>
    </BentoFolioLayout>
  );
};
export default page;
