import Image from "next/image";
import styled from "styled-components";
import Button from "./Button";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const ProductWrapper = styled.div``;
const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  img {
    max-width: 100%;
    width: fit-content;
    height: fit-content;
    max-height: 130px;
  }
`;
const Title = styled(Link)`
  font-weight: normal;
  font-size: 0.9rem;
  color: inherit;
  text-decoration: none;
  margin: 0;
`;
const ProductInfoBox = styled.div`
  margin-top: 5px;
`;
const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;
const Price = styled.div`
  font-size: 1rem;
  font-weight: 700;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1rem;
    text-align: left;
  }
`;
const ProductImage = styled.img``;

export default function ProductBox({ _id, title, description, price, images }) {
  const url = "/product/" + _id;
  const { addProduct } = useContext(CartContext);
  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <ProductImage src={images[0]} alt="" />
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>₹{price}</Price>
          <Button block={1} primary={1} outline={1} onClick={() => addProduct(_id)}>
            Add to Cart
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
