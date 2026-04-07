"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const server = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/json" });
    const data = {
        products: [
            { id: 1, title: "First Product" },
            { id: 2, title: "Second Product" },
            { id: 3, title: "Third Product" },
            { id: 4, title: "Fourth Product" },
        ],
    };
    res.write(JSON.stringify(data));
    res.end();
});
const PORT = 5000;
server.listen(PORT);
console.log(`Server running at http://localhost:${PORT}/`);
// "scripts": {
//   "build": "tsc -p .",
//   "start": "node dist/index.js",
//   "dev": "nodemon --watch src --ext ts --exec ts-node ./src/index.ts"
// }
//# sourceMappingURL=index.js.map