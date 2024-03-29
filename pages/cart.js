import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
  gap: 40px;
  margin-top: 40px;
  table thead tr th:nth-child(3),
  table tbody tr td:nth-child(3),
  table tbody tr.subtotal td:nth-child(2),
  table tbody tr.total td:nth-child(2) {
    text-align: right;
  }
  table tbody tr.subtotal td:nth-child(2) {
    font-size: 1.4rem;
  }
  table tbody tr.total td:nth-child(2) {
    font-size: 1.6rem;
    font-weight: bold;
  }
`;
const ProductInfoCell = styled.td`
  padding: 10px 0;
`;
const ProductImageBox = styled.div`
  width: 70px;
  height: 70px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 90px;
      max-height: 90px;
    }
  }
`;
const QuantityLabel = styled.span`
  padding: 0 13px;
  display: block;

  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;
const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;
const ProductImage = styled.img``;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [shippingFee, setShippingFee] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios
        .post("/api/cart", { ids: cartProducts })
        .then((response) => setProducts(response.data));
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
    axios.get("/api/settings?name=shippingFee").then((res) => {
      setShippingFee(res.data.value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get("/api/address").then((response) => {
      setName(response.data.name);
      setEmail(response.data.email);
      setCity(response.data.city);
      setPostalCode(response.data.postalCode);
      setStreetAddress(response.data.streetAddress);
      setCountry(response.data.country);
    });
  }, [session]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  let productsTotal = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    productsTotal += price;
  }
  let total = productsTotal + parseInt(shippingFee || 0);

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>BlazeBuy | Thank You</title>
        </Head>
        <Header />
        <Center>
          <ColumnsWrapper>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <h1>Thanks for your order!</h1>
                <p>We will email you when your order is dispatched.</p>
              </WhiteBox>
            </RevealWrapper>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>BlazeBuy | Cart</title>
      </Head>
      <Header />
      <Center>
        <ColumnsWrapper>
          <RevealWrapper delay={0} origin={"left"}>
            <WhiteBox>
              <h2>Cart</h2>
              {!cartProducts?.length && (
                <div style={{ paddingBottom: "30px" }}>Your Cart is empty</div>
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
                            <ProductImage src={product.images[0]} alt="" />
                          </ProductImageBox>
                          {product.title}
                        </ProductInfoCell>
                        <td>
                          <Button
                            onClick={() => lessOfThisProduct(product._id)}
                          >
                            -
                          </Button>
                          <QuantityLabel>
                            {
                              cartProducts.filter((id) => id === product._id)
                                .length
                            }
                          </QuantityLabel>
                          <Button
                            onClick={() => moreOfThisProduct(product._id)}
                          >
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
                    <tr className="subtotal">
                      <td colSpan={2}>
                        <h4>Products Total</h4>
                      </td>
                      <td>₹{productsTotal}</td>
                    </tr>
                    <tr className="subtotal">
                      <td colSpan={2}>
                        <h4>Shipping Fee</h4>
                      </td>
                      <td>₹{shippingFee}</td>
                    </tr>
                    <tr className="total">
                      <td colSpan={2}>
                        <h4>Total</h4>
                      </td>
                      <td>₹{total}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
              {products?.length > 0 && (
                <p
                  style={{
                    fontSize: "13px",
                    textAlign: "right",
                    marginTop: "0",
                    paddingBottom: "15px",
                  }}
                >
                  *Use coupon code: <b>TENOFF</b>
                  <br />
                  <span>(to claim 10% discount on payment page.)</span>
                </p>
              )}
            </WhiteBox>
          </RevealWrapper>
          {!!cartProducts?.length && (
            <RevealWrapper delay={0}>
              <WhiteBox>
                <h2>Order Information</h2>

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
                <Button black={1} block={1} onClick={goToPayment}>
                  Continue to Payment
                </Button>
              </WhiteBox>
            </RevealWrapper>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
