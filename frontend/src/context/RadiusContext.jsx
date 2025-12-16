import { createContext, useContext, useState } from "react";

const RadiusContext = createContext(null);

export const RadiusProvider = ({ children }) => {
  const [radius, setRadius] = useState(5); // default radius (km)

  return (
    <RadiusContext.Provider value={{ radius, setRadius }}>
      {children}
    </RadiusContext.Provider>
  );
};

export const useRadius = () => {
  const context = useContext(RadiusContext);
  if (!context) {
    throw new Error("useRadius must be used inside RadiusProvider");
  }
  return context;
};
