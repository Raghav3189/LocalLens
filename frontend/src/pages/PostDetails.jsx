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
  const [topPosts, setTopPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = res.data.post || res.data;
        console.log(data);
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
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTopPosts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/top`);
        setTopPosts(res.data.posts || res.data);
      } catch (err) {
        console.error("Error fetching top posts:", err);
      }
    };

    fetchPost();
    fetchTopPosts();
  }, [id, token]);

  const handleLike = async () => {
    if (!token) {
      setAlert({
        show: true,
        message: "Please log in to like posts",
        type: "error",
      });
      return;
    }

    setLiking(true);
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.success) {
        setLiked(res.data.liked);
        setPost((prev) => ({
          ...prev,
          likes: res.data.likes,
        }));
      }
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!token) {
      setAlert({
        show: true,
        message: "Please log in to comment",
        type: "error",
      });
      return;
    }

    if (!comment.trim()) return;

    setCommenting(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPost = res.data.post || res.data;
      setPost({
        ...updatedPost,
        images: updatedPost.images || [],
        comments: updatedPost.comments || [],
      });
      setComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
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
    arrows: false,
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading post details...</LoadingText>
        </LoadingContainer>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <ErrorContainer>
          <ErrorIcon>
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </ErrorIcon>
          <ErrorTitle>Post Not Found</ErrorTitle>
          <ErrorText>
            The post you're looking for doesn't exist or has been removed.
          </ErrorText>
          <BackButton onClick={() => navigate("/complaints")}>
            ← Back to Complaints
          </BackButton>
        </ErrorContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <MainContent>
          <PostCard>
            <PostHeader>
              <BackLink onClick={() => navigate("/complaints")}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </BackLink>
              <StatusBadge>Active</StatusBadge>
            </PostHeader>

            <Title>{post.title}</Title>

            {post.images && post.images.length > 0 && (
              <ImageSection>
                <StyledSlider {...sliderSettings}>
                  {post.images.map((img, index) => (
                    <ImageWrapper key={index}>
                      <PostImage
                        src={
                          img.startsWith("http")
                            ? img
                            : `http://localhost:5000${img}`
                        }
                        alt={`post-${index}`}
                      />
                    </ImageWrapper>
                  ))}
                </StyledSlider>
              </ImageSection>
            )}

            <Description>{post.description}</Description>

            <PostStats>
              <StatItem>
                <StatIcon>❤️</StatIcon>
                <StatText>{post.likes || 0} Likes</StatText>
              </StatItem>
              <StatItem>
                <StatIcon>💬</StatIcon>
                <StatText>{post.comments?.length || 0} Comments</StatText>
              </StatItem>
            </PostStats>

            <ActionBar>
              <LikeButton onClick={handleLike} disabled={liking} $liked={liked}>
                {liking ? (
                  <ButtonSpinner />
                ) : (
                  <>
                    <ButtonIcon $animate={liked}>
                      {liked ? "💖" : "🤍"}
                    </ButtonIcon>
                    <span>{liked ? "Liked" : "Like"}</span>
                  </>
                )}
              </LikeButton>
            </ActionBar>
          </PostCard>

          <CommentsCard>
            <SectionHeader>
              <SectionIcon>💬</SectionIcon>
              <SectionTitle>
                Comments ({post.comments?.length || 0})
              </SectionTitle>
            </SectionHeader>

            <CommentForm onSubmit={handleComment}>
              <CommentInputWrapper>
                <CommentInput
                  type="text"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={commenting}
                />
                <SubmitButton
                  type="submit"
                  disabled={commenting || !comment.trim()}
                >
                  {commenting ? <ButtonSpinner small /> : "Post"}
                </SubmitButton>
              </CommentInputWrapper>
            </CommentForm>

            <CommentList>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((c, i) => (
                  <CommentItem key={i}>
                    <CommentAvatar>
                      {c.user?.charAt(0).toUpperCase() || "U"}
                    </CommentAvatar>
                    <CommentContent>
                      <CommentAuthor>{c.user || "Anonymous"}</CommentAuthor>
                      <CommentText>{c.text}</CommentText>
                    </CommentContent>
                  </CommentItem>
                ))
              ) : (
                <EmptyComments>
                  <EmptyIcon>💬</EmptyIcon>
                  <EmptyText>
                    No comments yet. Be the first to comment!
                  </EmptyText>
                </EmptyComments>
              )}
            </CommentList>
          </CommentsCard>
        </MainContent>

        <Sidebar>
          <SidebarCard>
            <SidebarHeader>
              <SidebarTitle>Trending Posts</SidebarTitle>
            </SidebarHeader>

            {topPosts && topPosts.length > 0 ? (
              <TopPostList>
                {topPosts.slice(0, 5).map((p, index) => (
                  <TopPostItem
                    key={p._id}
                    onClick={() => navigate(`/post/${p._id}`)}
                  >
                    <TopPostContent>
                      <TopPostTitle>{p.title}</TopPostTitle>
                      <TopPostLikes>
                        <LikeIcon>❤️</LikeIcon>
                        <span>{p.likes || 0}</span>
                      </TopPostLikes>
                    </TopPostContent>
                  </TopPostItem>
                ))}
              </TopPostList>
            ) : (
              <EmptyTopPosts>
                <EmptyTopIcon>📊</EmptyTopIcon>
                <EmptyTopText>No trending posts yet</EmptyTopText>
              </EmptyTopPosts>
            )}
          </SidebarCard>

          <InfoCard>
            <InfoTitle>Need Help?</InfoTitle>
            <InfoText>
              Report inappropriate content or reach out to community moderators
              for assistance.
            </InfoText>
            <ReportButton>Report Issue</ReportButton>
          </InfoCard>
        </Sidebar>
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

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 80px;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
  overflow-x: hidden;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  overflow-x: hidden;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  border: 2px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const BackLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #667eea;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    gap: 12px;
    color: #764ba2;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 16px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 24px 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const ImageSection = styled.div`
  margin: 0 -32px 32px -32px;
  width: calc(100% + 64px);
  max-width: calc(100% + 64px);
  overflow: hidden;
`;

const StyledSlider = styled(Slider)`
  .slick-list {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .slick-track {
    display: flex !important;
    align-items: center;
  }

  .slick-slide {
    height: auto;

    > div {
      height: 100%;
    }
  }

  .slick-dots {
    bottom: 20px;
    z-index: 10;

    li {
      margin: 0 4px;
    }

    li button {
      width: 10px;
      height: 10px;
      padding: 0;
    }

    li button:before {
      font-size: 10px;
      color: white;
      opacity: 0.5;
    }

    li.slick-active button:before {
      color: #667eea;
      opacity: 1;
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const Description = styled.p`
  font-size: 17px;
  color: #334155;
  line-height: 1.8;
  margin: 0 0 32px 0;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 24px;
  border-radius: 16px;
  border-left: 4px solid #667eea;
`;

const PostStats = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
  flex-wrap: wrap;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #fafbfc 100%);
  border-radius: 16px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  justify-content: center;
`;

const StatIcon = styled.span`
  font-size: 22px;
`;

const StatText = styled.span`
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 700;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const LikeButton = styled.button`
  padding: 10px 22px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid #667eea;
  background: ${(props) => (props.$liked ? "#667eea" : "white")};
  color: ${(props) => (props.$liked ? "white" : "#667eea")};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$liked ? "#556cd6" : "#eef2ff")};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ButtonIcon = styled.span`
  font-size: 24px;
  position: relative;
  z-index: 1;
  animation: ${(props) =>
    props.$animate ? "heartbeat 0.6s ease-in-out" : "none"};

  @keyframes heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.3);
    }
    50% {
      transform: scale(1.1);
    }
    75% {
      transform: scale(1.2);
    }
  }
`;

const ButtonSpinner = styled.div`
  width: ${(props) => (props.small ? "16px" : "20px")};
  height: ${(props) => (props.small ? "16px" : "20px")};
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CommentsCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  border: 2px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const SectionIcon = styled.span`
  font-size: 28px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
`;

const CommentForm = styled.form`
  margin-bottom: 32px;
`;

const CommentInputWrapper = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: ${(props) => (props.disabled ? "#f8f9fa" : "white")};

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 6px 20px rgba(102, 126, 234, 0.4)"};
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
`;

const CommentAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentAuthor = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
`;

const CommentText = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
`;

const EmptyComments = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;

  @media (max-width: 968px) {
    order: -1;
  }
`;

const SidebarCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 2px solid #f0f0f0;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const SidebarTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
`;

const TopPostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopPostItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: translateX(1px);
  }
`;

const TopPostContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopPostTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TopPostLikes = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
`;

const LikeIcon = styled.span`
  font-size: 14px;
`;

const EmptyTopPosts = styled.div`
  text-align: center;
  padding: 32px 16px;
`;

const EmptyTopIcon = styled.div`
  font-size: 40px;
  margin-bottom: 8px;
`;

const EmptyTopText = styled.p`
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  color: white;
`;

const InfoTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  opacity: 0.95;
`;

const ReportButton = styled.button`
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
  gap: 20px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
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
  font-size: 16px;
  color: #64748b;
  font-weight: 600;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  color: #cbd5e1;
  margin-bottom: 24px;
`;

const ErrorTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 12px 0;
`;

const ErrorText = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
  max-width: 400px;
`;

const BackButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
`;
