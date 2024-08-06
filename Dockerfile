FROM node:22.3.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 2244

CMD ["npm", "run", "start:dev"]