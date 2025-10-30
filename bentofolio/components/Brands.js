const Brands = () => {
  const brandItems = [
    { id: 1, icon: "assets/img/icons/notion.svg", name: "Notion" },
    { id: 2, icon: "assets/img/icons/webflow.svg", name: "Webflow" },
    { id: 3, icon: "assets/img/icons/mico.svg", name: "Miro" },
    { id: 4, icon: "assets/img/icons/framer.svg", name: "Framer" },
    { id: 5, icon: "assets/img/icons/zeplin.svg", name: "Zeplin" },
    { id: 6, icon: "assets/img/icons/figma.svg", name: "Figma" },
    { id: 7, icon: "assets/img/icons/notion.svg", name: "Notion" },
    { id: 8, icon: "assets/img/icons/webflow.svg", name: "Webflow" },
    { id: 9, icon: "assets/img/icons/mico.svg", name: "Mico" },
    { id: 10, icon: "assets/img/icons/framer.svg", name: "Framer" },
    { id: 11, icon: "assets/img/icons/zeplin.svg", name: "Zeplin" },
    { id: 12, icon: "assets/img/icons/figma.svg", name: "Figma" },
    { id: 13, icon: "assets/img/icons/notion.svg", name: "Notion" },
    { id: 14, icon: "assets/img/icons/webflow.svg", name: "Webflow" },
    { id: 15, icon: "assets/img/icons/mico.svg", name: "Mico" },
    { id: 16, icon: "assets/img/icons/framer.svg", name: "Framer" },
  ];
  return (
    <div className="working-with-area">
      <h2 className="main-common-title">
        Working With 50+ Brands ✨ Worldwide
      </h2>
      <div className="working-with-main">
        {brandItems.map((item) => (
          <div className="items" key={item.id}>
            <img src={item.icon} alt={item.name} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Brands;
