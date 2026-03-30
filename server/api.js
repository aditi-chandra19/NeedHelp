const users = [
  {
    id: "user-demo-1",
    email: "demo@example.com",
    password: "password123",
    name: "Community Hero",
    phone: "+91 98765 43210",
  },
];

const allowedProviders = ["google", "facebook"];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    request.on("error", reject);
  });
}

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function findUserByEmail(email = "") {
  const normalizedEmail = normalizeEmail(email);
  return users.find((user) => user.email === normalizedEmail);
}

function buildAuthResponse(user, message) {
  return {
    message,
    token: `demo-token-${user.id}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
}

function formatProviderName(provider) {
  return `${provider[0].toUpperCase()}${provider.slice(1)}`;
}

export async function handleApiRequest(request, response) {
  const { method, url = "" } = request;

  if (!url.startsWith("/api")) {
    return false;
  }

  if (method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return true;
  }

  if (method === "GET" && url === "/api/health") {
    sendJson(response, 200, {
      status: "ok",
      message: "Backend is running.",
      date: new Date().toISOString(),
    });
    return true;
  }

  if (method === "POST" && url === "/api/auth/login") {
    try {
      const { email = "", password = "" } = await readJsonBody(request);
      const user = findUserByEmail(email);

      if (!email.trim() || !password.trim()) {
        sendJson(response, 400, {
          message: "Email and password are required.",
        });
        return true;
      }

      if (!user || password !== user.password) {
        sendJson(response, 401, {
          message:
            "Invalid credentials. Use demo@example.com / password123 for the demo login.",
        });
        return true;
      }

      sendJson(response, 200, buildAuthResponse(user, "Login successful."));
    } catch (error) {
      sendJson(response, 400, {
        message: error.message || "Unable to process login request.",
      });
    }

    return true;
  }

  if (method === "POST" && url === "/api/auth/register") {
    try {
      const {
        fullName = "",
        email = "",
        phone = "",
        password = "",
        confirmPassword = "",
        agreeToTerms = false,
      } = await readJsonBody(request);
      const normalizedEmail = normalizeEmail(email);

      if (
        !fullName.trim() ||
        !normalizedEmail ||
        !phone.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        sendJson(response, 400, {
          message: "All registration fields are required.",
        });
        return true;
      }

      if (password !== confirmPassword) {
        sendJson(response, 400, {
          message: "Password and confirm password must match.",
        });
        return true;
      }

      if (!agreeToTerms) {
        sendJson(response, 400, {
          message: "You must agree to the terms before creating an account.",
        });
        return true;
      }

      if (findUserByEmail(normalizedEmail)) {
        sendJson(response, 409, {
          message: "An account with this email already exists.",
        });
        return true;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email: normalizedEmail,
        password,
        name: fullName.trim(),
        phone: phone.trim(),
      };

      users.push(newUser);

      sendJson(
        response,
        201,
        buildAuthResponse(newUser, "Account created successfully.")
      );
    } catch (error) {
      sendJson(response, 400, {
        message: error.message || "Unable to process registration request.",
      });
    }

    return true;
  }

  if (
    method === "POST" &&
    (url === "/api/auth/social-login" || url === "/api/auth/social-register")
  ) {
    try {
      const { provider = "" } = await readJsonBody(request);
      const normalizedProvider = provider.trim().toLowerCase();
      const action = url.endsWith("social-register") ? "signup" : "login";

      if (!allowedProviders.includes(normalizedProvider)) {
        sendJson(response, 400, {
          message: "Unsupported social provider.",
        });
        return true;
      }

      sendJson(response, 200, {
        message: `${formatProviderName(
          normalizedProvider
        )} ${action} reached the backend. Add real OAuth credentials when you are ready.`,
      });
    } catch (error) {
      sendJson(response, 400, {
        message: error.message || "Unable to process social authentication.",
      });
    }

    return true;
  }

  sendJson(response, 404, {
    message: "Route not found.",
  });
  return true;
}
