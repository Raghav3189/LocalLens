# 1. Use an official Node.js runtime as base image
FROM node:18

# 2. Set working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the backend source code
COPY . .

# 6. Expose the backend port (matches your .env PORT=5000)
EXPOSE 5000

# 7. Define environment variables (optional, can override at runtime)
ENV PORT=5000

# 8. Start the backend server
CMD ["npm", "start"]
