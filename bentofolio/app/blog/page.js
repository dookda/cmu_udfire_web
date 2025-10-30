import BlogItem from "@/components/BlogItem";
import BentoFolioLayout from "@/layout/BentoFolioLayout";
const page = () => {
  const blogItems = [
    {
      id: 1,
      title: "Want To Upgrade Your Brain? Stop Doing These 7 Things",
      img: "assets/img/blog/blog-img-1.jpg",
      category: "Development",
      date: "Nov 6, 2023",
      readingTime: "15 min",
    },
    {
      id: 2,
      title: "Want To Upgrade Your Brain? Stop Doing These 7 Things",
      img: "assets/img/blog/blog-img-2.jpg",
      category: "Development",
      date: "Nov 6, 2023",
      readingTime: "15 min",
    },
    {
      id: 3,
      title: "Want To Upgrade Your Brain? Stop Doing These 7 Things",
      img: "assets/img/blog/blog-img-3.jpg",
      category: "Development",
      date: "Nov 6, 2023",
      readingTime: "15 min",
    },
    {
      id: 4,
      title: "Want To Upgrade Your Brain? Stop Doing These 7 Things",
      img: "assets/img/blog/blog-img-4.jpg",
      category: "Development",
      date: "Nov 6, 2023",
      readingTime: "15 min",
    },
    {
      id: 5,
      title: "Want To Upgrade Your Brain? Stop Doing These 7 Things",
      img: "assets/img/blog/blog-img-5.jpg",
      category: "Development",
      date: "Nov 6, 2023",
      readingTime: "15 min",
    },
    {
      id: 6,
      title: "Want To Upgrade Your Brain? Stop Doing These 7 Things",
      img: "assets/img/blog/blog-img-6.jpg",
      category: "Development",
      date: "Nov 6, 2023",
      readingTime: "15 min",
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
                  My Recent Article and Publications
                </h1>
                <p>
                  I'm here to help if you're searching for a product designer to
                  bring your idea to life or a design partner to help take your
                  business to the next level.
                </p>
              </div>
            </div>
            <div className="article-publications article-area">
              <div className="article-publications-main">
                <div className="row">
                  {blogItems.map((item) => (
                    <BlogItem item={item} />
                  ))}
                </div>
              </div>
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
                      ></path>
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
                      ></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </BentoFolioLayout>
  );
};
export default page;
