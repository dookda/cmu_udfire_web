import WorkTogether from "@/components/WorkTogether";
import BentoFolioLayout from "@/layout/BentoFolioLayout";
import Link from "next/link";
const page = () => {
  const projectItems = [
    {
      id: 1,
      title: "FlowSaaS - SaaS Application Tools",
      subtitle: "SaaS App | UI UX Design",
      img: "/assets/img/projects/project-1.png",
    },
    {
      id: 2,
      title: "AIMug - AI Writing Application Tools",
      subtitle: "Product Design | Application",
      img: "/assets/img/projects/project-2.png",
    },
    {
      id: 3,
      title: "FlowArch - Architecture Service Website",
      subtitle: "UI UX Design | Development",
      img: "/assets/img/projects/project-3.png",
    },
  ];
  return (
    <BentoFolioLayout>
      <div className="col-xl-8">
        <div className="card content-box-card">
          <div className="card-body portfolio-card">
            <div className="top-info">
              <div className="text">
                <h1 className="main-title">
                  Check Out My Latest <span>Projects</span>
                </h1>
                <p>
                  I'm here to help if you're searching for a product designer to
                  bring your idea to life or a design partner to help take your
                  business to the next level.
                </p>
              </div>
            </div>
            <div className="portfolio-area">
              <div className="row g-4 parent-container">
                {projectItems.map((item) => (
                  <div className="col-lg-12" key={item.id}>
                    <div className="portfolio-item">
                      <div className="image">
                        <img
                          src={item.img}
                          alt={`project-${item.id}`}
                          className="img-fluid w-100"
                        />
                        <a
                          href={item.img}
                          className="gallery-popup full-image-preview parent-container"
                        >
                          <svg
                            className="icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          >
                            <path d="M10 4.167v11.666M4.167 10h11.666" />
                          </svg>
                        </a>
                      </div>
                      <div className="text">
                        <div className="info">
                          <Link href="portfolio-details" className="title">
                            {item.title}
                          </Link>
                          <p className="subtitle">{item.subtitle}</p>
                        </div>
                        <div className="visite-btn">
                          <Link href="portfolio-details">
                            Visit Site
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
                              />
                              <path
                                d="M4.66699 4.5835H9.91699V9.8335"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pagination">
                <ul className="list-unstyled">
                  <li className="prev">
                    <button>
                      <svg
                        className="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                      </svg>
                    </button>
                  </li>
                  <li>
                    <button>1</button>
                  </li>
                  <li>
                    <button>2</button>
                  </li>
                  <li>
                    <button>3</button>
                  </li>
                  <li>
                    <button className="next-page-btn">
                      <span className="dots">
                        <i className="fas fa-ellipsis-h" />
                      </span>
                      <span className="next-page">
                        <svg
                          className="icon icon-arrow-right"
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 17 5-5-5-5" />
                          <path d="m13 17 5-5-5-5" />
                        </svg>
                      </span>
                      <span className="next-page-number">Next 4 pages</span>
                    </button>
                  </li>
                  <li>
                    <button>100</button>
                  </li>
                  <li className="next">
                    <button>
                      <svg
                        className="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
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
