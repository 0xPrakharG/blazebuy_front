import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin-top: 40px;
`;
const Box1 = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 30px 0;
  height: max-content;
`;
const Box2 = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 30px;
  height: max-content;
`;
const ProductInfoCell = styled.td`
  padding: 10px 0;
`;
const ProductImageBox = styled.div`
  width: 135px;
  height: 135px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    width: fit-content;
    height: fit-content;
  }
`;
const QuantityLabel = styled.span`
  padding: 0 5px;
`;
const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios
        .post("/api/cart", { ids: cartProducts })
        .then((response) => setProducts(response.data));
    }
  }, [cartProducts]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box1>
            <h2>Cart</h2>
            {!cartProducts?.length && (
              <div style={{ marginBottom: "30px" }}>Your Cart is empty</div>
            )}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <Image
                            src={product.images[0]}
                            alt=""
                            width={100}
                            height={100}
                          />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>
                          -
                        </Button>
                        <QuantityLabel>
                          {
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                        </QuantityLabel>
                        <Button onClick={() => moreOfThisProduct(product._id)}>
                          +
                        </Button>
                      </td>
                      <td>
                        ₹
                        {product.price *
                          cartProducts.filter((id) => id === product._id)
                            .length}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <h4>Total</h4>
                    </td>
                    <td></td>
                    <td>₹{total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box1>
          {!!cartProducts?.length && (
            <Box2>
              <h2>Order Information</h2>
              <form method="post" action="/api/checkout">
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />
                <CityHolder>
                  <Input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(ev) => setCity(ev.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(ev) => setPostalCode(ev.target.value)}
                  />
                </CityHolder>
                <Input
                  type="text"
                  placeholder="Street Address"
                  value={streetAddress}
                  onChange={(ev) => setStreetAddress(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(ev) => setCountry(ev.target.value)}
                />
                <input
                  type="hidden"
                  name="products"
                  value={cartProducts.join(",")}
                />
                <Button black={1} block={1} type="submit">
                  Continue to Payment
                </Button>
              </form>
            </Box2>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
