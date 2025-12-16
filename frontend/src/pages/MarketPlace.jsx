import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductDetails";
import Navbar from "../components/Navbar";
import BorderButton from "../components/BorderButton";
import { useRadius } from "../context/RadiusContext";

/* ------------------ DEBOUNCE HOOK ------------------ */
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

/* ------------------ COMPONENT ------------------ */
const Marketplace = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const { radius } = useRadius(); // ✅ GLOBAL radius
  const debouncedSearch = useDebounce(search, 500);

  /* ------------------ LOCATION ------------------ */
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: 18.5204, lng: 73.8567 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setUserLocation({ lat: 18.5204, lng: 73.8567 }),
      { timeout: 8000 }
    );
  }, []);

  /* ------------------ FETCH PRODUCTS ------------------ */
  useEffect(() => {
    if (!userLocation) return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius, // ✅ from Navbar
          type,
          search: debouncedSearch,
        });

        const res = await fetch(
          `http://localhost:5000/api/products/marketplace?${params}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();

        setProducts(data.products || []);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [userLocation, radius, type, debouncedSearch]);

  /* ------------------ HANDLERS ------------------ */
  const handleProductClick = useCallback(
    (product) => setSelectedProduct(product),
    []
  );

  const renderedProducts = useMemo(
    () =>
      products.map((product) => (
        <MotionCard
          key={product._id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <ProductCard
            product={product}
            onClick={() => handleProductClick(product)}
          />
        </MotionCard>
      )),
    [products, handleProductClick]
  );

  /* ------------------ RENDER ------------------ */
  return (
    <>
      <Navbar />

      <Container>
        <Controls>
          <SearchInput
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* ❌ Radius dropdown REMOVED */}

          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All</option>
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
          </Select>

          <BorderButton onClick={() => navigate("/AddProduct")}>
            Add Product
          </BorderButton>
        </Controls>

        {loading ? (
          <Grid>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </Grid>
        ) : products.length === 0 ? (
          <Empty>
            <h3>No products found</h3>
            <p>Try changing filters or adding a new product</p>
            <BorderButton onClick={() => navigate("/AddProduct")}>
              Add Product
            </BorderButton>
          </Empty>
        ) : (
          <AnimatePresence>
            <Grid layout>{renderedProducts}</Grid>
          </AnimatePresence>
        )}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </Container>
    </>
  );
};

export default Marketplace;

/* ------------------ STYLES ------------------ */

const Container = styled.div`
  max-width: 1280px;
  margin: auto;
  padding: 32px 20px;
`;

const Controls = styled.div`
  position: sticky;
  top: 70px;
  z-index: 10;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #ddd;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #ddd;
  font-size: 15px;
  cursor: pointer;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const MotionCard = styled(motion.div)`
  height: 100%;
`;

const Skeleton = styled.div`
  height: 320px;
  border-radius: 16px;
  background: linear-gradient(
    100deg,
    #eee 40%,
    #f5f5f5 50%,
    #eee 60%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;

  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #555;

  h3 {
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 20px;
  }
`;
