FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .
RUN npx prisma migrate reset
RUN npx prisma generate && npx prisma db push

EXPOSE 3000

CMD npm run dev