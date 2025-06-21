# Use official Node image
FROM node:20

# Install Python3 (needed by yt-dlp)
RUN apt-get update && \
    apt-get install -y python3 curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy app files
COPY . .

# Install Node.js dependencies
RUN npm install

# Start app
CMD ["node", "index.js"]
