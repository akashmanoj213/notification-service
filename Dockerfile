FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD [ "node", "src/server.js" ]

ENV NODE_ENV=production
ENV PORT=5000
ENV SERVICE_NAME=notification-service
ENV SMTP_HOST=prodsendgridaz1.pru.intranet.asia
ENV SMTP_PORT=25
ENV SENDER_ADDRESS=no_reply@prudentialhealth.in