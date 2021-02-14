# pull the official base image  
FROM node:13.12.0-alpine as build
 
# set your working directory
RUN mkdir /client
WORKDIR /client
 
# add `/app/node_modules/.bin` to $PATH  
ENV PATH /client/app/node_modules/.bin:$PATH  
 
# install application dependencies  
COPY ./package.json /client/package.json
RUN npm install --silent  
RUN npm install react-scripts -g  

# copy code to container path and build
COPY ./ /client
RUN npm run build

# Build app
FROM nginx
COPY --from=build /client/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]