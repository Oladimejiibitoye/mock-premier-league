# Base image
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install both production and dev dependencies, as we'll need TypeScript compiler
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Install TypeScript globally if needed (or locally as a dev dependency)
RUN npm install -g typescript

# Build the application (compile TypeScript into JavaScript)
RUN npm run build

# Expose the port the app will run on
EXPOSE 4000

# Command to run the app in production
CMD ["npm", "run", "prod"]
