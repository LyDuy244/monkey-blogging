import Heading from '../components/layout/Heading'
import Layout from '../components/layout/Layout'

const CategoryPage = () => {
  return (
    <Layout>
      <div className="container">
        <div className="pt-10"></div>
        <Heading>Danh mục</Heading>
        <div className="grid-layout grid-layout--primary">
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;