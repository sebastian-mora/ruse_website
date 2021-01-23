# pull the official base image  
FROM node:13.12.0-alpine  
 
# set your working directory  
WORKDIR /  
 
# add `/app/node_modules/.bin` to $PATH  
ENV PATH /app/node_modules/.bin:$PATH  
 
# install application dependencies  
COPY package.json ./  
RUN npm install --silent  
RUN npm install react-scripts -g  
 
# Build app
FROM nginx
COPY ./build /usr/share/nginx/html
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]