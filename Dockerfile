FROM node:latest

# Create the directory!
RUN mkdir -p /usr/src/site
WORKDIR /usr/src/site

# Copy and Install our site
COPY package.json /usr/src/site
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG JWT_SECRET

ENV JWT_SECRET $JWT_SECRET
ENV GITHUB_CLIENT_SECRET $GITHUB_CLIENT_SECRET
ENV GITHUB_CLIENT_ID $GITHUB_CLIENT_ID
ENV CI=false

RUN npm install
RUN npm run build



# For Debugging
#RUN apt-get update && apt-get install -y \
#    nano \
#    curl \
#    git \
#    && rm -rf /var/lib/apt/lists/*


COPY . /usr/src/site

# Start me!
CMD ["npm", "run", "start"]
