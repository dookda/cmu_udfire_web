"use client";
import { sliderProps } from "@/utility/sliderProps";
import Link from "next/link";
import Slider from "react-slick";
const BlogSlider = () => {
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
  ];
  return (
    <div className="article-publications">
      <h2 className="main-common-title">Article and Publications</h2>
      <div className="article-publications-main">
        <Slider
          {...sliderProps.blogSlider}
          className="row article-publications-slider"
        >
          {blogItems.map((item) => (
            <div className="col-lg-6" key={item.id}>
              <div className="article-publications-item">
                <div className="image">
                  <Link href="article" className="d-block w-100">
                    <img
                      src={item.img}
                      alt="blog-img-1"
                      className="img-fluid w-100"
                    />
                  </Link>
                  <Link href="article" className="tags">
                    {item.category}
                  </Link>
                </div>
                <div className="text">
                  <Link href="article" className="title">
                    {item.title}
                  </Link>
                  <ul className="list-unstyled">
                    <li>{item.readingTime} read</li>
                    <li>{item.date}</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
export default BlogSlider;
