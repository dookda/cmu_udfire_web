import BentoFolioLayout from "@/layout/BentoFolioLayout";
import Link from "next/link";
const page = () => {
  return (
    <BentoFolioLayout>
      <div className="col-xl-8">
        <div className="card content-box-card">
          <div className="card-body portfolio-card article-details-card">
            <div className="article-details-area">
              <div className="main-image">
                <img
                  src="assets/img/blog/blog-img-1.jpg"
                  alt="blog-img-1"
                  className="img-fluid w-100"
                />
              </div>
              <ul className="list-unstyled article-tags">
                <li>15 min read</li>
                <li>Nov 6, 2023</li>
                <li>1.5k Views</li>
              </ul>
              <div className="article-details-text">
                <h3 className="main-title">
                  Want To Upgrade Your Brain? Stop Doing 7 Things
                </h3>
                <p>
                  Mastering the Art of Email Marketing tips for Success pattern
                  of living, including their behaviors, habits, and daily
                  routines. It encompasses everything from their diet, exercise
                  routines, and sleep habits to their recreational activities,
                  social interactions, and work habits. A person's lifestyle
                  plays a significant role in determining their overall
                  well-being, including their physical and mental health, as
                  well as their happiness and satisfaction with life. A healthy
                  lifestyle, which includes a balanced diet, regular exercise,
                  and a healthy sleep pattern, can improve an individual's
                  quality of life
                </p>
                <p>
                  A healthy lifestyle, which includes a balanced diet, regular
                  exercise, and a healthy sleep pattern, can improve an
                  individual's quality of life and reduce the risk of chronic
                  diseases. On the other hand, unhealthy lifestyle habits, such
                  as smoking, excessive alcohol consumption, and a sedentary
                  lifestyle, can have negative impacts on one's health and
                  well-being. Thus, making intentional choices about one's
                  lifestyle can lead to improved health, happiness, and
                  longevity.
                </p>
                <blockquote>
                  <p>
                    " There are many different forms of travel, including road
                    trips, cruises, backpacking, and more, each offering its own
                    unique set of experiences and adventures. "
                  </p>
                </blockquote>
                <p>
                  The Role of Storytelling in Email Marketing CampaignsEmail
                  Marketing Automation: Streamlining Your Campaigns for Results
                  can improve an individual's quality of life and reduce the
                  risk of chronic diseases. On the other hand, unhealthy
                  lifestyle habits, such as smoking, excessive alcohol
                  consumption, and a sedentary lifestyle, can have negative
                  impacts on one's health and well-being. Thus, making
                  intentional choices about one's lifestyle can lead to improved
                  health, happiness, and longevity
                </p>
                <h3 className="main-title inner-title">
                  The Role of Storytelling in Email Marketing
                </h3>
                <p>
                  Lifestyle refers to an individual's habits, behaviors, and
                  patterns of living. encompasses all aspects of a person's
                  daily life, including their diet, exercise routine Lifestyle
                  choices can also impact a person's financial, social, and
                  environmental well-being. A person's lifestyle plays a major
                  role in determining their overall health, happy happiness, and
                  longevity.
                </p>
                <ul className="list-unstyled listed-info">
                  <li>
                    Lifestyle refers to an individual's habits, behaviors, and
                    patterns of living.
                  </li>
                  <li>
                    It encompasses all aspects of a person's daily life,
                    including their diet, exercise routine.
                  </li>
                  <li>
                    Lifestyle choices can also impact a person's financial,
                    social, and environmental well-being.
                  </li>
                  <li>
                    A person's lifestyle plays a major role in determining their
                    overall health, happiness, and quality of life.
                  </li>
                </ul>
                <div className="tags-and-share">
                  <div className="tags">
                    <h3 className="title">Tags:</h3>
                    <ul className="list-unstyled">
                      <li>
                        <a href="#">Development</a>
                      </li>
                      <li>
                        <a href="#">Design Trend</a>
                      </li>
                    </ul>
                  </div>
                  <div className="share">
                    <h3 className="title">Share:</h3>
                    <div className="social-media-icon mt-0">
                      <ul className="list-unstyled">
                        <li>
                          <a href="#">
                            <i className="fab fa-facebook" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-pinterest" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-github" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-youtube" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="related-post">
                  <h2 className="main-common-title">Related Post</h2>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="article-publications-item">
                        <div className="image">
                          <Link href="article" className="d-block w-100">
                            <img
                              src="assets/img/blog/blog-img-1.jpg"
                              alt="blog-img-1"
                              className="img-fluid w-100"
                            />
                          </Link>
                          <Link href="article" className="tags">
                            Development
                          </Link>
                        </div>
                        <div className="text">
                          <Link href="article" className="title">
                            Want To Upgrade Your Brain? Stop Doing These 7
                            Things
                          </Link>
                          <ul className="list-unstyled">
                            <li>15 min read</li>
                            <li>Nov 6, 2023</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="article-publications-item">
                        <div className="image">
                          <Link href="article" className="d-block w-100">
                            <img
                              src="assets/img/blog/blog-img-2.jpg"
                              alt="blog-img-2"
                              className="img-fluid w-100"
                            />
                          </Link>
                          <Link href="article" className="tags">
                            Development
                          </Link>
                        </div>
                        <div className="text">
                          <Link href="article" className="title">
                            Want To Upgrade Your Brain? Stop Doing These 7
                            Things
                          </Link>
                          <ul className="list-unstyled">
                            <li>15 min read</li>
                            <li>Nov 6, 2023</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="leave-comments-area">
                  <h2 className="main-common-title">Leave a Comment</h2>
                  <div className="comments-box">
                    <div className="row gx-3">
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control shadow-none"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label">Email</label>
                          <input
                            type="text"
                            className="form-control shadow-none"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-4">
                          <label className="form-label">Comment</label>
                          <textarea
                            className="form-control shadow-none"
                            rows={4}
                            placeholder="Type details about your inquiry"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <button className="submit-btn" type="submit">
                          Post Comment
                          <svg
                            className="icon"
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.5 11.6665V6.6665H12.5"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17.5 6.6665L10 14.1665L2.5 6.6665"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BentoFolioLayout>
  );
};
export default page;
