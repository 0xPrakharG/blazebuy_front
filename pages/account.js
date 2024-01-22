import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;
`;
const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  async function login() {
    await signIn("google");
  }

  function saveAddress() {
    const data = { name, email, city, postalCode, streetAddress, country };
    axios.put("/api/address", data);
  }

  useEffect(() => {
    axios.get("/api/address").then((response) => {
      setName(response.data.name);
      setEmail(response.data.email);
      setCity(response.data.city);
      setPostalCode(response.data.postalCode);
      setStreetAddress(response.data.streetAddress);
      setCountry(response.data.country);
      setLoaded(true);
    });
  }, []);
  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0} origin={"left"}>
              <WhiteBox>
                <h2>Wishlist</h2>
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <h2>Account Details</h2>
                {!loaded && <Spinner fullWidth={true} />}
                {loaded && (
                  <>
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
                    <Button black={1} block={1} onClick={saveAddress}>
                      Save
                    </Button>
                    <hr />
                  </>
                )}
                {session && (
                  <Button primary={1} onClick={logout}>
                    Logout
                  </Button>
                )}
                {!session && (
                  <Button primary={1} onClick={login}>
                    Login
                  </Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}