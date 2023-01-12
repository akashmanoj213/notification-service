FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD [ "node", "src/server.js" ]

ENV NODE_ENV=production
ENV PORT=5000
ENV TWILIO_ACCOUNT_SID=AC1b3129fd9b929e45ff38e44ec5648d9a
ENV TWILIO_AUTH_TOKEN=4443677dc38fd7b50935e81aa46e9ee6
ENV TWILIO_SENDER_NUMBER=+16802013809
ENV SERVICE_NAME=notification-service