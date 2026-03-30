import http from "node:http";
import { handleApiRequest } from "./api.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(async (request, response) => {
  const handled = await handleApiRequest(request, response);

  if (handled) {
    return;
  }

  response.writeHead(404, {
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify({ message: "Route not found." }));
});

server.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});
