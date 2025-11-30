import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "../components/FilledButton";

const Complaints = () => {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [radius, setRadius] = useState(3);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(newLocation);
        console.log("New location set:", newLocation);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Please allow location access to view nearby posts.");
      }
    );
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userLocation) return;
      console.log("hi");
      console.log(userLocation);
      console.log(radius);
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/posts/nearby?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=${radius}`
        );
        console.log(res.data.posts);
        setPosts(res.data.posts || []);
        setPopularPosts((res.data.posts || []).slice(0, 3));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [userLocation, radius]);

  return (
    <>
      <Navbar />
      <Container>
        <Header>
          <HeaderContent>
            <HeaderIcon>📢</HeaderIcon>
            <HeaderText>
              <Title>Community Complaints</Title>
              <Subtitle>Report and track issues in your neighborhood</Subtitle>
            </HeaderText>
          </HeaderContent>
          <Button onClick={() => navigate("/create")}>
            <span>Create Post</span>
          </Button>
        </Header>

        <MainLayout>
          <LeftSection>
            <FilterCard>
              <FilterHeader>
                <FilterIconWrapper>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </FilterIconWrapper>
                <FilterTitle>Filter by Distance</FilterTitle>
              </FilterHeader>
              <FilterControls>
                <FilterLabel>Show posts within:</FilterLabel>
                <Select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                >
                  <option value={1}>1 km radius</option>
                  <option value={3}>3 km radius</option>
                  <option value={5}>5 km radius</option>
                  <option value={10}>10 km radius</option>
                </Select>
              </FilterControls>
            </FilterCard>

            {loading ? (
              <LoadingState>
                <Spinner />
                <LoadingText>Loading nearby complaints...</LoadingText>
              </LoadingState>
            ) : posts.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </EmptyIcon>
                <EmptyTitle>No complaints found nearby</EmptyTitle>
                <EmptyText>
                  Try increasing the search radius or be the first to create a
                  post in your area.
                </EmptyText>
                <EmptyButton onClick={() => navigate("/create")}>
                  Create First Post
                </EmptyButton>
              </EmptyState>
            ) : (
              <PostList>
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    onClick={() => navigate(`/post/${post._id}`)}
                  >
                    <PostCardLayout>
                      <PostImageWrapper>
                        {post.images && post.images.length > 0 ? (
                          <PostThumbnail
                            src={post.images[0]}
                            alt={post.title}
                          />
                        ) : (
                          <PlaceholderImage>
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                              />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </PlaceholderImage>
                        )}
                      </PostImageWrapper>

                      <PostContent>
                        <PostHeader>
                          <PostTitle>{post.title}</PostTitle>
                          <PostBadge>Active</PostBadge>
                        </PostHeader>

                        <Description>{post.description}</Description>

                        <PostFooter>
                          <FooterItem>
                            <FooterIcon>📍</FooterIcon>
                            <span>Nearby</span>
                          </FooterItem>
                          <FooterItem>
                            <FooterIcon>👁️</FooterIcon>
                            <span>View Details</span>
                          </FooterItem>
                        </PostFooter>
                      </PostContent>
                    </PostCardLayout>
                  </PostCard>
                ))}
              </PostList>
            )}
          </LeftSection>

          <RightSection>
            <SidebarCard>
              <SidebarHeader>
                <StarIcon>⭐</StarIcon>
                <SidebarTitle>Trending Posts</SidebarTitle>
              </SidebarHeader>

              {popularPosts.length === 0 ? (
                <EmptyPopular>
                  <EmptyPopularIcon>📊</EmptyPopularIcon>
                  <EmptyPopularText>No trending posts yet</EmptyPopularText>
                </EmptyPopular>
              ) : (
                <PopularList>
                  {popularPosts.map((p, index) => (
                    <PopularCard
                      key={p._id}
                      onClick={() => navigate(`/post/${p._id}`)}
                    >
                      <PopularContent>
                        {p.images && p.images.length > 0 && (
                          <PopularImage src={p.images[0]} alt={p.title} />
                        )}
                        <PopularInfo>
                          <PopularTitle>{p.title}</PopularTitle>
                          <PopularDesc>{p.description}</PopularDesc>
                        </PopularInfo>
                      </PopularContent>
                    </PopularCard>
                  ))}
                </PopularList>
              )}
            </SidebarCard>

            <InfoCard>
              <InfoIcon>💡</InfoIcon>
              <InfoTitle>Quick Tip</InfoTitle>
              <InfoText>
                Include photos and detailed descriptions to help resolve
                complaints faster.
              </InfoText>
            </InfoCard>
          </RightSection>
        </MainLayout>
      </Container>
    </>
  );
};

export default Complaints;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 80px;
  overflow-x: hidden;

  @media (max-width: 968px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderIcon = styled.div`
  font-size: 48px;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSection = styled.div`
  overflow: hidden;
  max-width: 100%;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 968px) {
    order: -1;
  }
`;

const FilterCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    // border-color: #667eea;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const FilterIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FilterTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  font-size: 15px;
  color: #666;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 10px 16px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &:hover {
    border-color: #cbd5e1;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PostCard = styled.div`
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  max-width: 100%;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    // border-color: #667eea;
  }
`;

const PostCardLayout = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PostImageWrapper = styled.div`
  flex-shrink: 0;
  width: 180px;
  height: 180px;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const PostThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.6;
`;

const PostContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
`;

const PostTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PostBadge = styled.span`
  padding: 4px 12px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex: 1;
`;

const PostFooter = styled.div`
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const FooterIcon = styled.span`
  font-size: 16px;
`;

const SidebarCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #f0f0f0;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const StarIcon = styled.span`
  font-size: 24px;
`;

const SidebarTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const PopularList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PopularCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: white;
    // border-color: #667eea;
  }
`;

const PopularContent = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
`;

const PopularImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

const PopularInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PopularTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const PopularDesc = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const EmptyPopular = styled.div`
  text-align: center;
  padding: 32px 16px;
`;

const EmptyPopularIcon = styled.div`
  font-size: 40px;
  margin-bottom: 8px;
`;

const EmptyPopularText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
`;

const InfoIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
`;

const InfoTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  opacity: 0.95;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 80px 20px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #666;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 16px;
  border: 2px dashed #cbd5e1;
`;

const EmptyIcon = styled.div`
  margin-bottom: 24px;
  color: #cbd5e1;

  svg {
    margin: 0 auto;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 24px;
`;

const EmptyButton = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`;
