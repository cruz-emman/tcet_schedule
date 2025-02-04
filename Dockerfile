FROM node

WORKDIR /app

COPY . .

RUN npm install --ignore-scripts

# niremove ko na lahat ng related sa prisma and nilagay sa start.sh script
COPY start.sh .
RUN chmod +x start.sh

# this is da key
CMD sh ./start.sh 

EXPOSE 3000


