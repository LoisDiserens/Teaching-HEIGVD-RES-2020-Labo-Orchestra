FROM node:14.17.1

# Dossier dédié à l'appli
WORKDIR /opt/musician

# Dépendences
COPY src/package-lock.json ./
RUN npm i

COPY src .

# Debut de l'app
ENTRYPOINT ["node", "musician.js"]