FROM node:20

WORKDIR /server

COPY dist/* ./dist/
COPY dist/classes/* ./dist/classes/
COPY dist/constants/* ./dist/constants/
COPY dist/jsonschemas/* ./dist/jsonschemas/
COPY dist/models/* ./dist/models/
COPY dist/types/* ./dist/types/
COPY package*.json ./

EXPOSE 8081

RUN npm install


HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --include --no-buffer \
    --header "Connection: close" \
    --header "Upgrade: websocket" \
    --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
    --header "Sec-WebSocket-Version: 13" \
    http://localhost:8081
ENTRYPOINT [ "node", "/server/dist/index.js" ]
