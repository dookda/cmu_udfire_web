const Experience = () => {
  const experiancesItems = [
    {
      id: 1,
      title: "Adobe",
      subTitle: "Senior UI UX Designer",
      icon: "/assets/img/icons/adobe.svg",
      date: "2021-2024",
    },
    {
      id: 2,
      title: "Google Inc.",
      subTitle: "Senior Product Designer",
      icon: "/assets/img/icons/google.svg",
      date: "2019-2021",
    },
    {
      id: 3,
      title: "Meta Inc.",
      subTitle: "Product Designer",
      icon: "/assets/img/icons/meta.svg",
      date: "2018-2019",
    },
    {
      id: 4,
      title: "Adobe",
      subTitle: "Senior UI UX Designer",
      icon: "/assets/img/icons/adobe.svg",
      date: "2017-2018",
    },
  ];
  return (
    <ul className="work-experiance-slider list-unstyled">
      {experiancesItems.map((item) => (
        <li key={item.id}>
          <div className="date">
            <p>{item.date}</p>
          </div>
          <div className="info">
            <div className="icon">
              <img src={item.icon} alt="adobe" />
            </div>
            <div className="text">
              <h4 className="title">{item.title}</h4>
              <h6 className="subtitle">{item.subTitle}</h6>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const WorkExperience = () => {
  return (
    <div className="card">
      <div className="card-body work-experiance-card">
        <h3 className="card-title">Work Experience</h3>
        <div className="work-experiance-main">
          <Experience />
          <Experience />
        </div>
      </div>
    </div>
  );
};
export default WorkExperience;
