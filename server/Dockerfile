# pull the official base image  
FROM node:14
 
# set your working directory
RUN mkdir /api
WORKDIR /api
 
# add `/app/node_modules/.bin` to $PATH  
ENV PATH /api/app/node_modules/.bin:$PATH  
 
# install application dependencies  
COPY ./package.json /api/package.json
RUN npm install --silent  

# copy code to container path and build
COPY ./ /api


EXPOSE 8080
 
CMD ["node", "server.js"]