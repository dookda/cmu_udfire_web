"use client";
import { useState } from "react";
import { Accordion } from "react-bootstrap";

const Faq = () => {
  const faqItems = [
    { id: 1, title: "What does a product designer need to know?" },
    { id: 2, title: "What does a product designer need to know?" },
    { id: 3, title: "What does a product designer need to know?" },
    { id: 4, title: "What does a product designer need to know?" },
    { id: 5, title: "What does a product designer need to know?" },
  ];

  const [active, setActive] = useState("collapse1");

  return (
    <div className="frequently-asked-questions">
      <h2 className="main-common-title">Frequently Asked Questions</h2>
      <div className="frequently-asked-questions-main">
        <Accordion className="accordion" defaultActiveKey={active}>
          {faqItems.map((item) => (
            <div className="accordion-item" key={item.id}>
              <h4 className="accordion-header">
                <Accordion.Toggle
                  as={"button"}
                  className={`accordion-button ${
                    `collapse${item.id}` == active ? "" : "collapsed"
                  }`}
                  eventKey={`collapse${item.id}`}
                  onClick={() =>
                    setActive(
                      active == `collapse${item.id}`
                        ? null
                        : `collapse${item.id}`
                    )
                  }
                >
                  What does a product designer need to know?
                  <span className="ms-auto">
                    <span className="icon ms-4">
                      <img
                        className="icon-plus"
                        src="assets/img/icons/plus.svg"
                        alt="plus"
                      />
                      <img
                        className="icon-minus d-none"
                        src="assets/img/icons/minus.svg"
                        alt="minus"
                      />
                    </span>
                  </span>
                </Accordion.Toggle>
              </h4>
              <Accordion.Collapse eventKey={`collapse${item.id}`}>
                <div className="accordion-body">
                  <p>
                    I'm here to help if you're searching for a product designer
                    to bring your idea to life or a design partner to help take
                    your business to the next level.
                  </p>
                </div>
              </Accordion.Collapse>
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
export default Faq;
