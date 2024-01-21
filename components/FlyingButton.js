import styled from "styled-components";
import { primary } from "@/lib/colors";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import { ButtonStyle } from "./Button";

const FylingButtonWrapper = styled.div`
  button {
    ${ButtonStyle}
    ${(props) =>
      props.main
        ? `
    background-color: ${primary};
    color: white;
    `
        : `
    background-color: transparent;
    color: ${primary};
    border: 1px solid ${primary};
    `}
    ${(props) =>
      props.white &&
      `
      background-color: white;
      border: 1px solid white;
      color: #222;
    `}
  }
`;
const FlyingImg = styled.img`
  @keyframes fly {
    100% {
      top: 0;
      left: 100%;
      opacity: 0;
      display: none;
      max-width: 50px;
      max-height: 50px;
    }
  }
  max-width: 100px;
  max-height: 100px;
  position: fixed;
  z-index: 8;
  opacity: 1;
  display: none;
  animation: fly 0.6s;
`;

export default function FlyingButton(props) {
  const { addProduct } = useContext(CartContext);
  const imageRef = useRef();
  function sendImageToCart(ev) {
    imageRef.current.style.display = "inline-block";
    imageRef.current.style.left = ev.clientX - 50 + "px";
    imageRef.current.style.top = ev.clientY - 50 + "px";
    setTimeout(() => {
      imageRef.current.style.display = "none";
    }, 500);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const reveal = imageRef.current.closest("div[data-sr-id]");
      if (reveal?.style.opacity === "1") {
        reveal.style.transform = "none";
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <FylingButtonWrapper
        main={props.main}
        white={props.white}
        onClick={() => addProduct(props._id)}
      >
        <FlyingImg src={props.src} alt="" ref={imageRef} />
        <button
          onClick={(ev) => {
            sendImageToCart(ev);
          }}
          {...props}
        />
      </FylingButtonWrapper>
    </>
  );
}
