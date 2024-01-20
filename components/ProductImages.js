import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
const BigImage = styled.img`
  max-width: 100%;
  max-height: 190px;
`;
const ImageButtons = styled.div`
  display: flex;
  gap: 5px;
  flex-grow: 0;
  margin-top: 10px;
`;
const ImageButton = styled.div`
  border: 2px solid #ccc;
  ${(props) =>
    props.active
      ? `
    border-color: #ccc; 
  `
      : `
    border-color: transparent;
  `}
  display: flex;
  align-items: center;
  border-radius: 5px;
  height: 40px;
  padding: 3px;
  cursor: pointer;
`;
const BigImageWrapper = styled.div`
  text-align: center;
`;

export default function ProductImages({ images }) {
  const [activeImage, setActiveImage] = useState(images?.[0]);
  return (
    <>
      <BigImageWrapper>
        <BigImage src={activeImage} alt="" />
      </BigImageWrapper>
      <ImageButtons>
        {images.map((image) => (
          <ImageButton
            key={image}
            active={image === activeImage}
            onClick={() => setActiveImage(image)}
          >
            <StyledImage src={image} alt="" />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}
