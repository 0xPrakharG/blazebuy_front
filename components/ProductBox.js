import styled from "styled-components";
import Link from "next/link";
import FlyingButton from "./FlyingButton";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";
import HeartSolidIcon from "./icons/HeartSolidIcon";
import { useState } from "react";
import axios from "axios";

const ProductWrapper = styled.div`
  button {
    width: 100%;
    justify-content: center;
  }
`;
const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  position: relative;
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
const WishlistButton = styled.button`
  border: 0;
  width: 20px !important;
  height: 20px;
  padding: 10px 28px 0 0;
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  cursor: pointer;
  ${(props) =>
    props.wished
      ? `
    color: red;
  `
      : `
    color: black;
  `}
  svg {
    width: 20px;
  }
`;
const ProductImage = styled.img``;

export default function ProductBox({
  _id,
  title,
  description,
  price,
  images,
  wished = false,
  onRemoveFromWishlist = () => {},
}) {
  const url = "/product/" + _id;
  const [isWished, setIsWished] = useState(wished);

  function addToWishlist(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const nextValue = !isWished;
    if (nextValue === false && onRemoveFromWishlist) {
      onRemoveFromWishlist(_id);
    }
    axios
      .post("/api/wishlist", {
        product: _id,
      })
      .then(() => {});
    setIsWished(nextValue);
  }
  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <WishlistButton wished={isWished} onClick={addToWishlist}>
            {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
          </WishlistButton>
          <ProductImage src={images?.[0]} alt="" />
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>₹{price}</Price>
          <FlyingButton _id={_id} src={images?.[0]}>
            Add to Cart
          </FlyingButton>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
