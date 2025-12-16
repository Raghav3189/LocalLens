import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import FButton from "../components/FilledButton";
import { useRadius } from "../context/RadiusContext";

const TABS = [
  { key: "complaint", label: "Complaints" },
  { key: "concern", label: "Concerns" },
  { key: "normal", label: "Posts" },
];

const Complaints = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("complaint");
  const [loading, setLoading] = useState(false);

  const { radius } = useRadius();
  const navigate = useNavigate();

  /* ---------- LOCATION ---------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => alert("Please allow location access")
    );
  }, []);

  /* ---------- FETCH POSTS ---------- */
  useEffect(() => {
    if (!userLocation) return;

    const controller = new AbortController();

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/posts/nearby`,
          {
            params: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              radius,
            },
            signal: controller.signal,
          }
        );
        setAllPosts(res.data.posts || []);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, [userLocation, radius]);

  /* ---------- MEMOIZED FILTERS ---------- */
  const posts = useMemo(
    () => allPosts.filter((p) => p.postType === activeTab),
    [allPosts, activeTab]
  );

  const trending = useMemo(() => posts.slice(0, 3), [posts]);

  return (
    <>
      <Navbar />
      <Container>
        {/* ---------- HEADER ---------- */}
        <Header>
          <HeaderLeft>
            <HeaderIcon>📢</HeaderIcon>
            <div>
              <Title>Community Feed</Title>
              <Subtitle>
                Complaints, concerns and posts around you
              </Subtitle>
            </div>
          </HeaderLeft>

          <FButton onClick={() => navigate("/create")}>
            Create Post
          </FButton>
        </Header>

        {/* ---------- TABS ---------- */}
        <Tabs>
          {TABS.map((t) => (
            <Tab
              key={t.key}
              $active={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </Tab>
          ))}
        </Tabs>

        <MainLayout>
          {/* ---------- LEFT ---------- */}
          <Left>
            <FeedWrapper>
              {loading ? (
                <Loading>Loading nearby posts…</Loading>
              ) : posts.length === 0 ? (
                <Empty>
                  <h3>No {activeTab}s nearby</h3>
                  <p>Increase radius or create the first post.</p>
                  <FButton onClick={() => navigate("/create")}>
                    Create Post
                  </FButton>
                </Empty>
              ) : (
                <List>
                  {posts.map((post) => (
                    <Card
                      key={post._id}
                      onClick={() => navigate(`/post/${post._id}`)}
                    >
                      <CardContent>
                        {/* Left side - Image */}
                        {post.images && post.images.length > 0 && (
                          <CardImage>
                            <img 
                              src={post.images[0]} 
                              alt={post.title}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </CardImage>
                        )}

                        {/* Right side - Text content */}
                        <CardText $hasImage={post.images && post.images.length > 0}>
                          <CardHeader>
                            <CardTitle>{post.title}</CardTitle>

                            {(post.postType === "complaint" ||
                              post.postType === "concern") && (
                              <Status $status={post.status}>
                                {post.status}
                              </Status>
                            )}
                          </CardHeader>

                          <Desc>{post.description}</Desc>

                        </CardText>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}
            </FeedWrapper>
          </Left>

          {/* ---------- RIGHT ---------- */}
          <Right>
            <SidebarCard>
              <SidebarHeader>
                <SidebarTitle>Trending</SidebarTitle>
              </SidebarHeader>

              {trending.length === 0 ? (
                <SmallText>No trending posts</SmallText>
              ) : (
                <TrendingList>
                  {trending.map((p) => (
                    <TrendingItem
                      key={p._id}
                      onClick={() => navigate(`/post/${p._id}`)}
                    >
                      <TrendingTitle>{p.title}</TrendingTitle>

                      <TagRow>
                        <Tag type={p.postType}>{p.postType}</Tag>

                        {(p.postType === "complaint" ||
                          p.postType === "concern") && (
                          <MiniStatus status={p.status}>
                            {p.status}
                          </MiniStatus>
                        )}
                      </TagRow>
                    </TrendingItem>
                  ))}
                </TrendingList>
              )}
            </SidebarCard>

            <InfoCard>
              <InfoIcon>💡</InfoIcon>
              <InfoTitle>Post Types</InfoTitle>
              <InfoText>
                • Complaints: civic & infrastructure issues <br />
                • Concerns: safety & social matters <br />
                • Posts: general neighborhood updates
              </InfoText>
            </InfoCard>
          </Right>
        </MainLayout>
      </Container>
    </>
  );
};

export default Complaints;

/* ===================== STYLES ===================== */

const Container = styled.div`
  max-width: 1400px;
  margin: auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

const HeaderIcon = styled.div`
  font-size: 42px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #666;
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eef0f6;
  margin-bottom: 28px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border-radius: 999px;
  border: none;
  background: ${({ $active }) =>
    $active ? "#667eea" : "#f5f6ff"};
  color: ${({ $active }) =>
    $active ? "#fff" : "#667eea"};
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: ${({ $active }) =>
      $active ? "#5a6ee0" : "#eef0ff"};
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div``;

const FeedWrapper = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #eef0f6;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #eaeaf0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.15);
    // border-color: #667eea;
  }
`;

const CardContent = styled.div`
  display: flex;
  gap: 16px;
  align-items: start;
`;

const CardImage = styled.div`
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f6ff;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
  }
`;

const CardText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Status = styled.span`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $status }) =>
    $status === "resolved"
      ? "linear-gradient(135deg,#667eea,#667eea)"
      : "linear-gradient(135deg,#667eea,#667eea)"};
  color: white;
  text-transform: capitalize;
  white-space: nowrap;
`;

const Desc = styled.p`
  margin: 0;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 100px;
`;

const SidebarCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 20px;
  border: 1px solid #eef0f6;
`;

const SidebarHeader = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
`;


const SidebarTitle = styled.h3`
  margin: 0;
`;

const TrendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TrendingItem = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #eef0f6;
  background: white;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border-color: #667eea;
    background: #fafbff;
  }
`;

const TrendingTitle = styled.div`
  font-weight: 600;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 6px;
`;

const Tag = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: ${({ type }) =>
    type === "complaint"
      ? "#fee2e2"
      : type === "concern"
      ? "#fef3c7"
      : "#e0e7ff"};
`;

const MiniStatus = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: ${({ status }) =>
    status === "resolved" ? "#dcfce7" : "#e0e7ff"};
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 18px;
  padding: 24px;
  color: white;
`;

const InfoIcon = styled.div`
  font-size: 28px;
`;

const InfoTitle = styled.h4`
  margin: 10px 0 6px;
`;

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.6;
`;

const Loading = styled.div`
  padding: 80px;
  text-align: center;
  color: #667eea;
  font-weight: 600;
`;

const Empty = styled.div`
  text-align: center;
  padding: 80px 20px;
`;

const SmallText = styled.p`
  color: #666;
`;