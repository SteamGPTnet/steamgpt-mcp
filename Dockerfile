# Glama / container checks: start the stdio proxy and answer introspection requests.
# Zero dependencies - no npm install step needed.
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY bin ./bin
CMD ["node", "bin/steamgpt-mcp.js"]
