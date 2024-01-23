import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

export default function HomePage({
  featuredProduct,
  newProducts,
  wishedNewProducts,
}) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const featuredProductId = "65a679ee8a5a9dd0ff1aac55";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {
    limit: 10,
    sort: { _id: -1 },
  });
  const { user } = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedNewProducts = await WishedProduct.find({
    userEmail: user.email,
    product: newProducts.map((p) => p._id.toString()),
  });
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: wishedNewProducts.map((i) => i.product.toString()),
    },
  };
}
