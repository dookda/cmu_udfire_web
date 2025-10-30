import Link from "next/link";

const BlogItem = ({ item }) => {
  return (
    <div className="col-lg-6" key={item.id}>
      <div className="article-publications-item">
        <div className="image">
          <Link href="article" className="d-block w-100">
            <img src={item.img} alt="blog-img-1" className="img-fluid w-100" />
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
  );
};
export default BlogItem;
