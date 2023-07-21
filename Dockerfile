FROM node:latest

# Create the directory!
RUN mkdir -p /usr/src/site
WORKDIR /usr/src/site

# Copy and Install our site
COPY package.json /usr/src/site
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG JWT_SECRET
ARG PUBLIC_ANALYTICS_URL
ARG PLAUSIBLE_API_KEY
ARG PLAUSIBLE_API_PATH
# env setup1
ENV JWT_SECRET $JWT_SECRET
ENV GITHUB_CLIENT_SECRET $GITHUB_CLIENT_SECRET
ENV GITHUB_CLIENT_ID $GITHUB_CLIENT_ID
ENV PUBLIC_ANALYTICS_URL $PUBLIC_ANALYTICS_URL
ENV PLAUSIBLE_API_KEY $PLAUSIBLE_API_KEY
ENV PLAUSIBLE_API_PATH $PLAUSIBLE_API_PATH
ENV CI=false

RUN npm install
COPY . /usr/src/site
RUN npm run build



# For Debugging
#RUN apt-get update && apt-get install -y \
#    nano \
#    curl \
#    git \
#    && rm -rf /var/lib/apt/lists/*

# Start me!
CMD ["npm", "run", "start"]
