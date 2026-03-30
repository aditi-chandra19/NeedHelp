import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { handleApiRequest } from "../server/api.js";

function needhelpDevApi() {
  return {
    name: "needhelp-dev-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        try {
          const handled = await handleApiRequest(request, response);

          if (!handled) {
            next();
          }
        } catch (error) {
          if (!response.headersSent) {
            response.writeHead(500, {
              "Content-Type": "application/json",
            });
          }

          response.end(
            JSON.stringify({
              message: error.message || "Unexpected API error.",
            })
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), needhelpDevApi()],
});
