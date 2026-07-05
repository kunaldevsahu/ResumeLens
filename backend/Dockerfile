FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Compile TypeScript
RUN npm run build

EXPOSE 3001

# Start the server in production mode
CMD ["npm", "start"]