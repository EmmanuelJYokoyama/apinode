FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally for hot-reload
RUN npm install -g nodemon

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Run with ts-node and nodemon for hot reload
CMD ["nodemon", "--exec", "ts-node", "src/app.ts"]
