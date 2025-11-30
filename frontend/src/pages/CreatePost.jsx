import React, { useState } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import Navbar from "../components/Navbar";
import FilledButton from "../components/FilledButton";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const CreatePost = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: null,
  });
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUseMyLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        setShowMap(false);
        setLoadingLocation(false);
      },
      (err) => {
        console.error("Location access denied:", err);
        alert("Please enable location access in your browser settings.");
        setLoadingLocation(false);
      }
    );
  };

  const handleChooseLocation = () => {
    setShowMap(true);
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          setLocation({ latitude: 20.5937, longitude: 78.9629 });
        }
      );
    }
  };

  // Map click handler
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        setLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      },
    });
    return null;
  };

  const handleRemoveImage = (index) => {
    const newImages = Array.from(formData.images).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages.length > 0 ? newImages : null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please select or use your location before submitting.");
      return;
    }

    setSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("latitude", location.latitude);
    data.append("longitude", location.longitude);
    if (user && user.id) {
      data.append("createdBy", user.id);
    } else {
      alert("You must be logged in to create a post.");
      setSubmitting(false);
      return;
    }

    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images", formData.images[i]);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/create`,
        data,
        {
          //tells the backend that files are being uploaded not only text so backend parses it correctly
          //this request contains form-data with possible files — handle it accordingly
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        alert("Post created successfully!");
        setFormData({ title: "", description: "", images: null });
        setLocation(null);
        setShowMap(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = loadingLocation || submitting;

  return (
    <>
      <Navbar />
      <Container>
        <Header>
          <HeaderIcon>✍️</HeaderIcon>
          <HeaderText>
            <Title>Create New Post</Title>
            <Subtitle>
              Share a complaint or concern with your community
            </Subtitle>
          </HeaderText>
        </Header>

        <FormCard onSubmit={handleSubmit}>
          <FormSection>
            <Label>Title *</Label>
            <Input
              type="text"
              placeholder="Enter a descriptive title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              disabled={isDisabled}
            />
          </FormSection>

          <FormSection>
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              disabled={isDisabled}
            />
          </FormSection>

          <FormSection>
            <Label>Upload Images</Label>
            <FileInputWrapper>
              <FileInputLabel disabled={isDisabled}>
                <UploadIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </UploadIcon>
                <span>Choose images or drag & drop</span>
                <FileInput
                  type="file"
                  multiple           //This attribute allows users to select multiple files at once.
                  accept="image/*"   //Restricts uploads to image files only.
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files); //converts filelist to actual array
                    const total = (formData.images?.length || 0) + newFiles.length;
                    if (total > 5) {
                      alert("You can upload up to 5 images only.");
                      return;
                    }

                    setFormData((prev) => ({
                      ...prev,  //spreads that into a new object -> spread operator, copies all existing keys from previous state.
                      //already exists->merge no->set it
                      //Overrides or updates just that one field(images)
                      images: prev.images
                        ? [...prev.images, ...newFiles]    
                        : newFiles,
                    }));
                  }}
                  disabled={isDisabled}
                />
              </FileInputLabel>
            </FileInputWrapper>

            {formData.images && formData.images.length > 0 && (
              <PreviewContainer>
                {Array.from(formData.images).map((file, index) => (
                  <PreviewWrapper key={index}>
                    <PreviewImg
                      src={URL.createObjectURL(file)}  //creates a temporary local URL from the file on your computer
                      //This allows the browser to instantly preview it without uploading it to the backend yet.
                      alt={`preview-${index}`}   //alt text
                    />
                    <RemoveButton
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isDisabled}
                    >
                      ×
                    </RemoveButton>
                  </PreviewWrapper>
                ))}
              </PreviewContainer>
            )}
          </FormSection>

          <FormSection>
            <Label>Location *</Label>
            <LocationButtons>
              <LocationButton
                type="button"  //ensures it doesn’t accidentally submit the form.
                onClick={handleUseMyLocation}
                disabled={isDisabled}
                $active={location && !showMap}
              >
                <ButtonIcon>📍</ButtonIcon>
                <span>
                  {loadingLocation ? "Getting location..." : "Use My Location"}
                </span>
              </LocationButton>
              <LocationButton
                type="button"
                onClick={handleChooseLocation}
                disabled={isDisabled}
                $active={showMap}
              >
                <ButtonIcon>🗺️</ButtonIcon>
                <span>Choose on Map</span>
              </LocationButton>
            </LocationButtons>

            {location && !showMap && (
              <LocationInfo>
                <InfoText>
                  Location set: {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </InfoText>
              </LocationInfo>
            )}

            {showMap && location && (
              <MapWrapper>
                <MapInstruction>
                  Click on the map to set your location
                </MapInstruction>
                <MapContainer
                  center={[location.latitude, location.longitude]}  //sets the map’s initial center.
                  zoom={15}
                  style={{
                    height: "350px",
                    width: "100%",
                    borderRadius: "12px",
                  }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationSelector />
                  <Marker position={[location.latitude, location.longitude]} />  
                </MapContainer>
              </MapWrapper>
            )}
          </FormSection>

          <SubmitSection>
            <FilledButton
              text={submitting ? "Creating Post..." : "Create Post"}
              type="submit"
              loading={submitting}
              disabled={isDisabled}
            />
          </SubmitSection>
        </FormCard>
      </Container>
    </>
  );
};

export default CreatePost;

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 20px auto;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
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
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const FormCard = styled.form`
  background: white;
  border-radius: 20px;
  padding: 40px;
  border: 2px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const FormSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s ease;
  font-family: inherit;
  background: ${(props) => (props.disabled ? "#f8f9fa" : "white")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};

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
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  font-size: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;
  background: ${(props) => (props.disabled ? "#f8f9fa" : "white")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};

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
  }
`;

const FileInputWrapper = styled.div`
  width: 100%;
`;

const FileInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  background: ${(props) => (props.disabled ? "#f8f9fa" : "#fafbfc")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) => (props.disabled ? "#cbd5e1" : "#667eea")};
    background: ${(props) => (props.disabled ? "#f8f9fa" : "white")};
  }

  span {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
  }
`;

const UploadIcon = styled.div`
  color: #667eea;
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const PreviewWrapper = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 1;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    background: ${(props) =>
      props.disabled ? "rgba(0, 0, 0, 0.7)" : "rgba(220, 38, 38, 0.9)"};
    transform: ${(props) => (props.disabled ? "none" : "scale(1.1)")};
  }
`;

const LocationButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LocationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "white"};
  color: ${(props) => (props.$active ? "white" : "#1a1a1a")};
  border: 2px solid ${(props) => (props.$active ? "transparent" : "#e2e8f0")};
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) => (props.disabled ? "#e2e8f0" : "#667eea")};
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 4px 12px rgba(102, 126, 234, 0.2)"};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonIcon = styled.span`
  font-size: 18px;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 14px 18px;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
`;

const InfoText = styled.span`
  font-size: 14px;
  color: #15803d;
  font-weight: 600;
`;

const MapWrapper = styled.div`
  margin-top: 16px;
`;

const MapInstruction = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
  text-align: center;
  font-weight: 500;
`;

const SubmitSection = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e2e8f0;
`;
