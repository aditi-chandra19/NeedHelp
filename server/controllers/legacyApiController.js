import { handleApiRequest } from "../api.js";

export async function legacyApiController(request, response) {
  const handled = await handleApiRequest(request, response);

  if (!handled) {
    response.status(404).json({ message: "Route not found." });
  }
}
