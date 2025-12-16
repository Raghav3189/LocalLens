import { useEffect, useState, memo, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import api from "../api/axios";
import Navbar from "../components/Navbar";

/* ===================== Skeleton ===================== */

const shimmer = keyframes`
  100% { transform: translateX(100%); }
`;

const Skeleton = styled.div`
  height: ${({ h }) => h || 20}px;
  background: #e5e7eb;
  border-radius: 10px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.6),
      transparent
    );
    transform: translateX(-100%);
    animation: ${shimmer} 1.2s infinite;
  }
`;

/* ===================== Item Card ===================== */

const ItemCard = memo(({ item, onEdit, onDelete, onResolve }) => (
  <ItemRow>
    <ItemInfo>
      <ItemTitle>{item.title || item.name}</ItemTitle>

      <Meta>
        {item.postType && <Tag>{item.postType}</Tag>}
        {item.type && <Tag>{item.type}</Tag>}
        {item.status && (
          <Status $status={item.status}>{item.status}</Status>
        )}
      </Meta>
    </ItemInfo>

    <Actions>
      {onEdit && <EditButton onClick={() => onEdit(item)}>Edit</EditButton>}

      {item.status === "active" && onResolve && (
        <ResolveButton onClick={() => onResolve(item._id)}>
          Resolve
        </ResolveButton>
      )}

      <DeleteButton
        onClick={() => {
          if (window.confirm("Delete permanently?")) {
            onDelete(item._id);
          }
        }}
      >
        Delete
      </DeleteButton>
    </Actions>
  </ItemRow>
));

/* ===================== Profile ===================== */

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);

  /* ---------- POST EDIT ---------- */
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPostType, setEditPostType] = useState("normal");

  /* ---------- PRODUCT EDIT ---------- */
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    type: "sell",
    contactEmail: "",
    contactPhone: "",
  });

  /* ---------- FETCH ---------- */
  useEffect(() => {
    const fetchData = async () => {
      const [auth, postRes, productRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/posts/my"),
        api.get("/products/my"),
      ]);

      setUser(auth.data);
      setPosts(postRes.data);
      setProducts(productRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  /* ---------- ACTIONS ---------- */

  const deletePost = useCallback(async (id) => {
    await api.delete(`/posts/${id}`);
    setPosts((p) => p.filter((x) => x._id !== id));
  }, []);

  const resolvePost = useCallback(async (id) => {
    const res = await api.patch(`/posts/${id}/status`, {
      status: "resolved",
    });

    setPosts((p) => p.map((x) => (x._id === id ? res.data : x)));
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await api.delete(`/products/${id}`);
    setProducts((p) => p.filter((x) => x._id !== id));
  }, []);

  const data = activeTab === "posts" ? posts : products;

  return (
    <>
      <Navbar />
      <Page>
        <ProfileCard>
          {/* ---------- HEADER ---------- */}
          {loading ? (
            <>
              <Skeleton h={28} />
              <Skeleton h={18} />
            </>
          ) : (
            <>
              <UserName>{user?.name}</UserName>
              <UserEmail>{user?.email}</UserEmail>
            </>
          )}

          {/* ---------- TABS ---------- */}
          <Tabs>
            {["posts", "products"].map((tab) => (
              <TabButton
                key={tab}
                $active={activeTab === tab}
                onClick={() => {
                  setActiveTab(tab);
                  setEditingPost(null);
                  setEditingProduct(null);
                }}
              >
                {tab.toUpperCase()}
              </TabButton>
            ))}
          </Tabs>

          {/* ---------- EDIT FORM ---------- */}
          {(editingPost || editingProduct) && (
            <EditBox>
              <EditHeader>
                {editingPost ? "Edit Post" : "Edit Product"}
              </EditHeader>

              {editingPost && (
                <>
                  <Label>Title</Label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <Label>Description</Label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(e.target.value)
                    }
                  />

                  <Label>Post Type</Label>
                  <Select
                    value={editPostType}
                    onChange={(e) =>
                      setEditPostType(e.target.value)
                    }
                  >
                    <option value="normal">Normal</option>
                    <option value="concern">Concern</option>
                    <option value="complaint">Complaint</option>
                  </Select>

                  <EditActions>
                    <SaveButton
                      onClick={async () => {
                        await api.put(
                          `/posts/${editingPost._id}`,
                          {
                            title: editTitle,
                            description: editDescription,
                            postType: editPostType,
                          }
                        );

                        setPosts((p) =>
                          p.map((x) =>
                            x._id === editingPost._id
                              ? {
                                  ...x,
                                  title: editTitle,
                                  description: editDescription,
                                  postType: editPostType,
                                }
                              : x
                          )
                        );
                        setEditingPost(null);
                      }}
                    >
                      Save
                    </SaveButton>
                    <CancelButton onClick={() => setEditingPost(null)}>
                      Cancel
                    </CancelButton>
                  </EditActions>
                </>
              )}

              {editingProduct && (
                <>
                  <Label>Name</Label>
                  <Input
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                  />

                  <Label>Description</Label>
                  <Textarea
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                  />

                  <FieldGroup>
                    <div>
                      <Label>Price</Label>
                      <Input
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Type</Label>
                      <Select
                        value={productForm.type}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            type: e.target.value,
                          })
                        }
                      >
                        <option value="sell">Sell</option>
                        <option value="rent">Rent</option>
                      </Select>
                    </div>
                  </FieldGroup>

                  <FieldGroup>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={productForm.contactEmail}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={productForm.contactPhone}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            contactPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </FieldGroup>

                  <EditActions>
                    <SaveButton
                      onClick={async () => {
                        const res = await api.put(
                          `/products/${editingProduct._id}`,
                          productForm
                        );

                        setProducts((p) =>
                          p.map((x) =>
                            x._id === editingProduct._id ? res.data : x
                          )
                        );
                        setEditingProduct(null);
                      }}
                    >
                      Save
                    </SaveButton>
                    <CancelButton onClick={() => setEditingProduct(null)}>
                      Cancel
                    </CancelButton>
                  </EditActions>
                </>
              )}
            </EditBox>
          )}

          {/* ---------- LIST ---------- */}
          <List>
            {!loading &&
              data.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onEdit={
                    activeTab === "posts"
                      ? (obj) => {
                          setEditingPost(obj);
                          setEditTitle(obj.title);
                          setEditDescription(obj.description);
                          setEditPostType(obj.postType || "normal");
                        }
                      : (obj) => {
                          setEditingProduct(obj);
                          setProductForm({
                            name: obj.name || "",
                            description: obj.description || "",
                            price: obj.price || "",
                            type: obj.type || "sell",
                            contactEmail: obj.contactEmail || "",
                            contactPhone: obj.contactPhone || "",
                          });
                        }
                  }
                  onDelete={
                    activeTab === "posts" ? deletePost : deleteProduct
                  }
                  onResolve={
                    activeTab === "posts" ? resolvePost : null
                  }
                />
              ))}
          </List>
        </ProfileCard>
      </Page>
    </>
  );
};

export default Profile;

/* ===================== STYLES ===================== */

const Page = styled.div`
  background: #f9fafb;
  padding: 40px 20px;
  min-height: calc(100vh - 80px);

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const ProfileCard = styled.div`
  max-width: 900px;
  margin: auto;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 24px 20px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const UserName = styled.h2`
  margin: 0;
  font-size: 28px;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const UserEmail = styled.p`
  margin-top: 6px;
  color: #6b7280;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  margin: 32px 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin: 24px 0;
    gap: 8px;
  }
`;

const TabButton = styled.button`
  padding: 10px 24px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: ${({ $active }) => ($active ? "#667eea" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#374151")};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 8px 20px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    flex: 1;
    padding: 10px 16px;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  flex: 1;
`;

const ItemTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const Meta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
    gap: 8px;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const BaseButton = styled.button`
  border-radius: 999px;
  padding: 8px 18px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 14px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 6px 14px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    flex: 1;
  }
`;

const EditButton = styled(BaseButton)`
  background: #f3f4f6;
  color: #374151;

  &:hover {
    background: #e5e7eb;
  }
`;

const DeleteButton = styled(BaseButton)`
  background: #fee2e2;
  color: #dc2626;

  &:hover {
    background: #fecaca;
  }
`;

const ResolveButton = styled(BaseButton)`
  background: #dcfce7;
  color: #166534;

  &:hover {
    background: #bbf7d0;
  }
`;

const Tag = styled.span`
  background: #eef2ff;
  color: #4338ca;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 3px 8px;
  }
`;

const Status = styled.span`
  background: ${({ $status }) =>
    $status === "resolved" ? "#dcfce7" : "#f3f4f6"};
  color: ${({ $status }) =>
    $status === "resolved" ? "#166534" : "#374151"};
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 3px 8px;
  }
`;

const EditBox = styled.div`
  background: #f9fafb;
  padding: 28px;
  border-radius: 18px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const EditHeader = styled.h3`
  margin: 0 0 16px 0;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Label = styled.label`
  display: block;
  margin-top: 14px;
  font-weight: 600;
  font-size: 14px;

  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 13px;
  }
`;

const Input = styled.input`
  width: 100%;
  margin-top: 6px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 15px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 14px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  margin-top: 6px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  min-height: 100px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 14px;
    min-height: 80px;
  }
`;

const Select = styled.select`
  width: 100%;
  margin-top: 6px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 15px;
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 14px;
  }
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SaveButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 26px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6ee0;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: 768px) {
    padding: 10px 22px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CancelButton = styled.button`
  background: #e5e7eb;
  color: #374151;
  border: none;
  padding: 12px 26px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;

  &:hover {
    background: #d1d5db;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 10px 22px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;