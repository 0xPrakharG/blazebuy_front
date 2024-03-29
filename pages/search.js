import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductsGrid from "@/components/ProductsGrid";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { debounce } from "lodash";
import Spinner from "@/components/Spinner";
import Head from "next/head";

const StyledInput = styled(Input)`
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.4rem;
`;
const InputWrapper = styled.div`
  margin: 25px 0;
  padding: 5px 0;
  position: sticky;
  top: 68px;
  background-color: #eee;
`;

export default function SearchPage() {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);
  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase]);

  function searchProducts(phrase) {
    axios
      .get("/api/products?phrase=" + encodeURIComponent(phrase))
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      });
  }
  return (
    <>
      <Head>
        <title>BlazeBuy | Search</title>
      </Head>
      <Header />
      <Center>
        <InputWrapper>
          <StyledInput
            autoFocus
            value={phrase}
            onChange={(ev) => setPhrase(ev.target.value)}
            placeholder="Search fo products..."
          />
        </InputWrapper>
        {!isLoading && phrase !== "" && products.length === 0 && (
          <h2>No products found for query &quot;{phrase}&quot;</h2>
        )}
        {isLoading && <Spinner fullWidth={true} />}
        {!isLoading && products.length > 0 && (
          <ProductsGrid products={products} />
        )}
      </Center>
    </>
  );
}
