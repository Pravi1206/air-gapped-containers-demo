 # Use the official Node.js image as the base image
 FROM jfrog.hub.vwgroup.com/remote-docker-io/node:14

 # Set the working directory in the container
 WORKDIR /app

 # Copy package.json and package-lock.json to the working directory
 COPY package*.json ./
 COPY node_modules ./

 # Copy the rest of the application code to the working directory
 COPY . .

 # Expose the port the app runs on
 EXPOSE 3000

 # Define the command to run the application
 CMD ["node", "app.js"]