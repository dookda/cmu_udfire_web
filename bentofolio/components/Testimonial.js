"use client";
import { sliderProps } from "@/utility/sliderProps";
import Slider from "react-slick";

const Testimonial = () => {
  return (
    <div className="client-feedback">
      <h2 className="main-common-title">Trusted By 1200+ Clients</h2>
      <Slider
        {...sliderProps.testimonialSlider}
        className="row client-feedback-slider"
      >
        <div className="col-lg-6">
          <div className="feedback-item">
            <div className="feedback-top-info">
              <div className="rating">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
              <div className="website">
                <a href="#">
                  Framer.com
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
                </a>
              </div>
            </div>
            <div className="details">
              <p>
                "We've been using BentoFolio for over a year now, and I must
                say, it's been a game-changer for us. The user interface is
                intuitive and the feature.
              </p>
            </div>
            <div className="designation">
              <p>
                <span>Oliver Clain</span> - Product Designer
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="feedback-item">
            <div className="feedback-top-info">
              <div className="rating">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
              <div className="website">
                <a href="#">
                  Framer.com
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
                </a>
              </div>
            </div>
            <div className="details">
              <p>
                "We've been using BentoFolio for over a year now, and I must
                say, it's been a game-changer for us. The user interface is
                intuitive and the feature.
              </p>
            </div>
            <div className="designation">
              <p>
                <span>Oliver Clain</span> - Product Designer
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="feedback-item">
            <div className="feedback-top-info">
              <div className="rating">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
              <div className="website">
                <a href="#">
                  Framer.com
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
                </a>
              </div>
            </div>
            <div className="details">
              <p>
                "We've been using BentoFolio for over a year now, and I must
                say, it's been a game-changer for us. The user interface is
                intuitive and the feature.
              </p>
            </div>
            <div className="designation">
              <p>
                <span>Oliver Clain</span> - Product Designer
              </p>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
};
export default Testimonial;
