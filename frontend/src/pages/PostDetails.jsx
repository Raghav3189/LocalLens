import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Alert from "../components/Alert";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/posts/${id}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        const data = res.data.post || res.data;

        setPost({
          ...data,
          images: data.images || [],
          comments: data.comments || [],
        });

        if (token && data.likedBy) {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          const userId = decoded.id || decoded._id;
          setLiked(data.likedBy.includes(userId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  /* ================= LIKE ================= */

  const handleLike = async () => {
    if (!token || liking) return;

    setLiking(true);
    setLiked((p) => !p);

    setPost((prev) => ({
      ...prev,
      likes: (prev.likes || 0) + (liked ? -1 : 1),
    }));

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLiked(res.data.liked);
      setPost((prev) => ({ ...prev, likes: res.data.likes }));
    } catch {
      setLiked((p) => !p);
      setPost((prev) => ({
        ...prev,
        likes: (prev.likes || 0) + (liked ? 1 : -1),
      }));
    } finally {
      setLiking(false);
    }
  };

  /* ================= COMMENT (FIXED) ================= */

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token || !comment.trim() || commenting) return;

    setCommenting(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPost = res.data.post;

      // ✅ FIX: functional update, trust backend
      setPost((prev) => ({
        ...prev,
        comments: updatedPost.comments,
      }));

      setComment("");
    } catch (err) {
      console.error("Comment error:", err);
      setAlert({
        show: true,
        message: "Failed to post comment",
        type: "error",
      });
    } finally {
      setCommenting(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: post?.images?.length > 1,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: post?.images?.length > 1,
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Center>
          <LoadingSpinner />
          <LoadingText>Loading post...</LoadingText>
        </Center>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <Center>
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyTitle>Post not found</EmptyTitle>
            <BackButton onClick={() => navigate("/complaints")}>
              ← Go Back
            </BackButton>
          </EmptyState>
        </Center>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <Main>
          <Card>
            <Header>
              <BackLink onClick={() => navigate("/complaints")}>
                ← Back
              </BackLink>
              <StatusBadge>{post.status}</StatusBadge>
            </Header>

            <Title>{post.title}</Title>

            {post.images.length > 0 && (
              <ImageBox>
                <StyledSlider {...sliderSettings}>
                  {post.images.map((img, i) => (
                    <ImageWrapper key={i}>
                      <Image
                        src={
                          img.startsWith("http")
                            ? img
                            : `http://localhost:5000${img}`
                        }
                        alt=""
                      />
                    </ImageWrapper>
                  ))}
                </StyledSlider>
              </ImageBox>
            )}

            <Description>{post.description}</Description>

            <InteractionBar>
              <StatsGroup>
                <StatItem>❤️ {post.likes || 0}</StatItem>
                <StatItem>💬 {post.comments.length}</StatItem>
              </StatsGroup>

              <LikeButton onClick={handleLike} disabled={liking}>
                {liked ? "❤️ Liked" : "🤍 Like"}
              </LikeButton>
            </InteractionBar>
          </Card>

          <Card>
            <CommentsTitle>Comments ({post.comments.length})</CommentsTitle>

            <CommentForm onSubmit={handleComment}>
              <CommentInput
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <CommentSubmit disabled={!comment.trim() || commenting}>
                Post
              </CommentSubmit>
            </CommentForm>

            <CommentsList>
              {post.comments.map((c, i) => {
                const name = c.user?.name || "Anonymous";
                return (
                  <CommentItem key={c._id || i}>
                    <CommentAvatar>{name[0]}</CommentAvatar>
                    <CommentContent>
                      <CommentAuthor>{name}</CommentAuthor>
                      <CommentText>{c.text}</CommentText>
                    </CommentContent>
                  </CommentItem>
                );
              })}
            </CommentsList>
          </Card>
        </Main>
      </Container>

      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
      )}
    </>
  );
};

export default PostDetails;

/* styles remain unchanged */

/* ================= STYLES ================= */

const Container = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid #eef0f6;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const BackLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
  padding: 8px 12px;
  border-radius: 8px;

  &:hover {
    background: #f5f6ff;
    transform: translateX(-2px);
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 6px 8px;
  }
`;

const BackIcon = styled.span`
  font-size: 18px;
`;

const StatusBadge = styled.span`
  background: ${({ $status }) =>
    $status === "resolved"
      ? "linear-gradient(135deg, #22c55e, #16a34a)"
      : "linear-gradient(135deg, #667eea, #764ba2)"};
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
  text-transform: capitalize;
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const Title = styled.h1`
  margin: 0 0 24px 0;
  font-size: 32px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const ImageBox = styled.div`
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    height: 300px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const StyledSlider = styled(Slider)`
  height: 100%;

  .slick-list,
  .slick-track,
  .slick-slide > div {
    height: 100%;
  }

  .slick-dots {
    bottom: 20px;
  }

  .slick-dots li button:before {
    color: white;
    font-size: 10px;
  }

  .slick-prev,
  .slick-next {
    z-index: 1;
    width: 40px;
    height: 40px;
  }

  .slick-prev {
    left: 20px;
  }

  .slick-next {
    right: 20px;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 40px;
  }
`;

const ImageWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Description = styled.p`
  background: #f9fafb;
  padding: 24px;
  border-radius: 14px;
  line-height: 1.7;
  color: #374151;
  font-size: 16px;
  margin: 0 0 24px 0;
  white-space: pre-wrap;

  @media (max-width: 768px) {
    padding: 20px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const InteractionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid #eef0f6;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatIcon = styled.span`
  font-size: 18px;
`;

const StatText = styled.span`
  font-weight: 600;
  color: #374151;
  font-size: 15px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 32px;
  border-radius: 999px;
  border: 2px solid ${({ $liked }) => ($liked ? "#667eea" : "#e2e8f0")};
  background: ${({ $liked }) =>
    $liked ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white"};
  color: ${({ $liked }) => ($liked ? "white" : "#374151")};
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.25);
    border-color: #667eea;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 24px;
  }
`;

const LikeIcon = styled.span`
  font-size: 20px;
  transition: transform 0.2s ease;

  ${LikeButton}:hover & {
    transform: scale(1.2);
  }
`;

const CommentsHeader = styled.div`
  margin-bottom: 20px;
`;

const CommentsTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const CommentForm = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 28px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 14px 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 14px;
  }
`;

const CommentSubmit = styled.button`
  padding: 14px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 24px;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyComments = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const EmptyCommentsIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const EmptyCommentsText = styled.p`
  color: #6b7280;
  font-size: 15px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 14px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }

  @media (max-width: 480px) {
    gap: 12px;
    padding: 14px;
  }
`;

const CommentAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

const CommentContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CommentAuthor = styled.div`
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
  font-size: 15px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CommentText = styled.p`
  margin: 0;
  color: #374151;
  line-height: 1.6;
  font-size: 15px;
  word-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Center = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #eef0f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  color: #667eea;
  font-weight: 600;
  font-size: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  max-width: 400px;
`;

const EmptyIcon = styled.div`
  font-size: 72px;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px 0;
`;

const BackButton = styled.button`
  padding: 12px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }
`;