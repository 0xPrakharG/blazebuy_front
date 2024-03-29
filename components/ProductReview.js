import styled from "styled-components";
import WhiteBox from "./WhiteBox";
import Input from "./Input";
import StarsRating from "./StarsRating";
import Textarea from "./Textarea";
import Button from "./Button";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;
const Subtitle = styled.h3`
  font-size: 1rem;
  margin-top: 5px;
`;
const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  gap: 20px;
  margin-bottom: 40px;
`;
const ReviewWrapper = styled.div`
  margin-bottom: 10px;
  border-top: 1px solid #eee;
  padding: 10px 0;
  h3 {
    margin: 3px 0;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
  }
  p {
    margin: 0;
    font-size: 0.7rem;
    line-height: 1rem;
    color: #555;
  }
`;
const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  time {
    font-size: 12px;
    color: #aaa;
  }
`;

export default function ProductReview({ product }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  function submitReview() {
    const data = {
      title,
      description,
      stars,
      product: product._id,
    };
    axios.post("/api/reviews", data).then((res) => {
      setTitle("");
      setDescription("");
      setStars(0);
      fetchReviews();
    });
  }

  async function fetchReviews() {
    setReviewsLoading(true);
    await axios.get("/api/reviews?product=" + product._id).then((res) => {
      setReviews(res.data);
      setReviewsLoading(false);
    });
  }

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Title>Reviews</Title>
      <ColsWrapper>
        <div>
          <WhiteBox>
            <Subtitle>Add a Review</Subtitle>
            <div>
              <StarsRating onChange={setStars} />
            </div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <Textarea
              placeholder="Was it good? Pros? Cons?"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
            <div>
              <Button onClick={submitReview} primary={1}>
                Add Review
              </Button>
            </div>
          </WhiteBox>
        </div>
        <div>
          <WhiteBox>
            <Subtitle>All Reviews</Subtitle>
            {reviewsLoading && <Spinner fullWidth={true} />}
            {reviews.length === 0 && <p>No reviews :(</p>}
            {reviews.length > 0 &&
              reviews.map((review) => (
                <ReviewWrapper key={review._id}>
                  <ReviewHeader>
                    <StarsRating
                      size={"sm"}
                      disabled={true}
                      defaultHowMany={review.stars}
                    />
                    <time>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </ReviewHeader>
                  <h3>{review.title}</h3>
                  <p>{review.description}</p>
                </ReviewWrapper>
              ))}
          </WhiteBox>
        </div>
      </ColsWrapper>
    </div>
  );
}
