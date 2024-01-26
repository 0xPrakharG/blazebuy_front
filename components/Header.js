import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";
import Center from "./Center";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/BarsIcon";
import Cart from "@/public/cart.png";
import SearchIcon from "./icons/SearchIcon";

const StyledHeader = styled.header`
  background-color: #222;
  position: sticky;
  top: 0;
  z-index: 10;
`;
const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 3;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  align-items: center;
`;
const NavLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;
const StyledNav = styled.nav`
  ${(props) =>
    props.mobilenavactive
      ? `
  display: block;
  `
      : `
  display: none;
  `}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;
const SideIcons = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  a {
    min-width: 20px;
    color: #aaa;
    display: inline-block;
    svg {
      width: 14px;
      height: 14px;
      @media screen and (min-width: 768px) {
        width: 20px;
        height: 20px;
      }
    }
  }
`;
const NavButton = styled.button`
  background-color: transparent;
  border: 0;
  width: 30px;
  height: 30px;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
const LogoImg = styled(Image)`
  height: 35px;
  width: 35px;
`;

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>
            <LogoImg src={Cart} width={100} height={100} alt="" />
          </Logo>
          <StyledNav mobilenavactive={mobileNavActive === true ? 1 : 0}>
            <NavLink href={"/"}>Home</NavLink>
            <NavLink href={"/products"}>All Products</NavLink>
            <NavLink href={"/categories"}>Categories</NavLink>
            <NavLink href={"/account"}>Account</NavLink>
            <NavLink href={"/cart"}>Cart ({cartProducts.length})</NavLink>
          </StyledNav>
          <SideIcons>
            <Link href={"/search"}>
              <SearchIcon />
            </Link>
            <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
              <BarsIcon />
            </NavButton>
          </SideIcons>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
