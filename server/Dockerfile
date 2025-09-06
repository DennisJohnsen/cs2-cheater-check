# This Dockerfile builds a container for the Node.js GSI server.

# Use an official Node.js runtime as the parent image.
# We'll use a small, Alpine-based image to keep the size down.
FROM node:18-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json (if it exists) to the container.
# This is done first to leverage Docker's layer caching for dependencies.
COPY package*.json ./

# Install any dependencies.
RUN npm install

# Copy the rest of the application source code into the container.
COPY . .

# Expose the port that the server will listen on.
# You will need to map this port from your host machine when running the container.
EXPOSE 3000

# Define the command to run the application.
# This command is run when the container starts.
CMD [ "npm", "start" ]