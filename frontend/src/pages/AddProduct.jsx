import React, { useState } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import Navbar from "../components/Navbar";
import FilledButton from "../components/FilledButton";
import api from "../api/axios"; // 🔴 IMPORTANT

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    priceUnit: "fixed",
    type: "sell",
    contactEmail: "",
    contactPhone: "",
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
          setLocation({ latitude: 18.5204, longitude: 73.8567 }); // Pune default
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

  const uploadToCloudinary = async (file) => {
    const sigRes = await fetch(
      "http://localhost:5000/api/cloudinary/signature"
    );

    if (!sigRes.ok) {
      throw new Error("Failed to get Cloudinary signature");
    }

    const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

    const data = new FormData();
    data.append("file", file);
    data.append("api_key", apiKey);
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("folder", "local_lens_products");

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      console.error("Cloudinary error:", err);
      throw new Error("Cloudinary upload failed");
    }

    const result = await uploadRes.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please select or use your location before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      // Upload images first
      let uploadedImageURLs = [];
      if (formData.images) {
        uploadedImageURLs = await Promise.all(
          Array.from(formData.images).map((img) =>
            uploadToCloudinary(img)
          )
        );
      }

      // 🔴 FIXED: use axios instance (JWT included)
      await api.post("/products", {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        priceUnit: formData.priceUnit,
        type: formData.type,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        latitude: location.latitude,
        longitude: location.longitude,
        images: uploadedImageURLs,
      });

      alert("Product added successfully! 🎉");

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        priceUnit: "fixed",
        type: "sell",
        contactEmail: "",
        contactPhone: "",
        images: null,
      });

      setLocation(null);
      setShowMap(false);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
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
          <HeaderIcon>🏪</HeaderIcon>
          <HeaderText>
            <Title>Add New Product</Title>
            <Subtitle>List your product for sale or rent in your local area</Subtitle>
          </HeaderText>
        </Header>

        <FormCard onSubmit={handleSubmit}>
          {/* Product Details Section */}
          <SectionDivider>
            <SectionTitle>Product Details</SectionTitle>
          </SectionDivider>

          <FormSection>
            <Label>Product Name *</Label>
            <Input
              type="text"
              placeholder="e.g., Canon EOS Camera"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isDisabled}
            />
          </FormSection>

          <FormSection>
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe your product in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              disabled={isDisabled}
            />
          </FormSection>

          <RowGroup>
            <FormSection>
              <Label>Price *</Label>
              <Input
                type="number"
                placeholder="5000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                min="0"
                step="0.01"
                required
                disabled={isDisabled}
              />
            </FormSection>

            <FormSection>
              <Label>Price Type *</Label>
              <Select
                value={formData.priceUnit}
                onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                required
                disabled={isDisabled}
              >
                <option value="fixed">Fixed Price</option>
                <option value="per_day">Per Day</option>
              </Select>
            </FormSection>
          </RowGroup>

          <FormSection>
            <Label>Listing Type *</Label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              disabled={isDisabled}
            >
              <option value="sell">For Sale</option>
              <option value="rent">For Rent</option>
            </Select>
          </FormSection>

          <FormSection>
            <Label>Product Images</Label>
            <FileInputWrapper>
              <FileInputLabel disabled={isDisabled}>
                <UploadIcon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </UploadIcon>
                <span>Choose images or drag & drop</span>
                <FileInput
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    const total = (formData.images?.length || 0) + newFiles.length;
                    if (total > 5) {
                      alert('You can upload up to 5 images only.');
                      return;
                    }
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images ? [...prev.images, ...newFiles] : newFiles
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
                    <PreviewImg src={URL.createObjectURL(file)} alt={`preview-${index}`} />
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

          {/* Contact Information Section */}
          <SectionDivider>
            <SectionTitle>Contact Information</SectionTitle>
          </SectionDivider>

          <FormSection>
            <Label>Email *</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              required
              disabled={isDisabled}
            />
          </FormSection>

          <FormSection>
            <Label>Phone Number *</Label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              required
              disabled={isDisabled}
            />
          </FormSection>

          {/* Location Section */}
          <SectionDivider>
            <SectionTitle>Location</SectionTitle>
          </SectionDivider>

          <FormSection>
            <Label>Set Your Location *</Label>
            <LocationButtons>
              <LocationButton
                type="button"
                onClick={handleUseMyLocation}
                disabled={isDisabled}
                $active={location && !showMap}
              >
                <ButtonIcon>📍</ButtonIcon>
                <span>{loadingLocation ? 'Getting location...' : 'Use My Location'}</span>
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
                  Location set: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </InfoText>
              </LocationInfo>
            )}

            {showMap && location && (
              <MapWrapper>
                <MapInstruction>Click on the map to set your location</MapInstruction>
                <MapContainer
                  center={[location.latitude, location.longitude]}
                  zoom={15}
                  style={{
                    height: '350px',
                    width: '100%',
                    borderRadius: '12px'
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
              text={submitting ? 'Adding Product...' : 'Add Product'}
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

export default AddProduct;

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

const SectionDivider = styled.div`
  margin: 32px 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;

  &:first-child {
    margin-top: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const RowGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
  background: ${props => props.disabled ? '#f8f9fa' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

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
  background: ${props => props.disabled ? '#f8f9fa' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

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

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s ease;
  font-family: inherit;
  background: ${props => props.disabled ? '#f8f9fa' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  background: ${props => props.disabled ? '#f8f9fa' : '#fafbfc'};
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    border-color: ${props => props.disabled ? '#cbd5e1' : '#667eea'};
    background: ${props => props.disabled ? '#f8f9fa' : 'white'};
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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    background: ${props => props.disabled ? 'rgba(0, 0, 0, 0.7)' : 'rgba(220, 38, 38, 0.9)'};
    transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
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
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.$active ? 'white' : '#1a1a1a'};
  border: 2px solid ${props => props.$active ? 'transparent' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    border-color: ${props => props.disabled ? '#e2e8f0' : '#667eea'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.2)'};
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