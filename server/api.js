import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { persistState } from "./db.js";

let users = [
  {
    id: "user-demo-1",
    email: "demo@example.com",
    password: "password123",
    name: "Community Hero",
    phone: "+91 98765 43210",
    address: "Connaught Place",
    walletBalance: 1250,
    karmaPoints: 280,
    notificationCount: 3,
    sosActive: false,
    overallRating: 4.7,
    tasksCompleted: 22,
    helpRequested: 10,
  },
];

const allowedProviders = ["google", "facebook"];
const authTokenIssuer = "needhelp-api";
const authTokenAudience = "needhelp-client";
const passwordHashPrefix = "$2";
const urgencyRank = {
  Emergency: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

const communitySummary = {
  activeUsers: "10,000+",
  tasksCompleted: "50,000+",
  averageResponse: "< 5 min",
  verifiedHelpers: "8,000+",
};
const platformFeeRate = 0.02;
const flatPlatformFee = 5;
const demoSimulationLabels = {
  success: "Payment approved",
  pending: "Payment pending",
  failed: "Payment failed",
};

const categoryCatalog = [
  { slug: "home-daily", label: "Home & Daily Help" },
  { slug: "vehicle-transport", label: "Vehicle & Transport" },
  { slug: "medical-emergency", label: "Medical & Emergency" },
  { slug: "delivery-pickup", label: "Delivery & Pickup" },
  { slug: "student-help", label: "Student Help" },
  { slug: "pet-animal-help", label: "Pet & Animal Help" },
  { slug: "personal-help", label: "Personal Help" },
  { slug: "event-social", label: "Event & Social" },
  { slug: "skill-based-help", label: "Skill-Based Help" },
  { slug: "tech-help", label: "Tech Help" },
  { slug: "shopping-help", label: "Shopping Help" },
  { slug: "local-information", label: "Local Information" },
  { slug: "unique-requests", label: "Unique Requests" },
  { slug: "quick-emergency", label: "Quick Emergency" },
];

const categorySpecificNeeds = {
  "home-daily": [
    "Plumbing issue",
    "Cleaning help",
    "Electrician support",
    "Furniture shifting",
  ],
  "vehicle-transport": [
    "Flat tyre support",
    "Jump start battery",
    "Ride assistance",
    "Mechanic help",
  ],
  "medical-emergency": [
    "Blood donor needed",
    "Medicine pickup",
    "Hospital companion",
    "Doctor contact help",
  ],
  "delivery-pickup": [
    "Parcel pickup",
    "Grocery delivery",
    "Document drop",
    "Medicine delivery",
  ],
  "student-help": [
    "Study buddy",
    "Exam revision help",
    "Project teammate",
    "Notes sharing",
  ],
  "pet-animal-help": [
    "Lost pet assistance",
    "Pet walk",
    "Pet sitting",
    "Emergency pet care",
  ],
  "personal-help": [
    "Elder support",
    "Companion help",
    "Errand support",
    "General assistance",
  ],
  "event-social": [
    "Event volunteer",
    "Decoration help",
    "Guest coordination",
    "Photography support",
  ],
  "skill-based-help": [
    "Repair work",
    "Design help",
    "Writing support",
    "Technical guidance",
  ],
  "tech-help": [
    "WiFi issue",
    "Laptop troubleshooting",
    "Phone setup",
    "Printer support",
  ],
  "shopping-help": [
    "Local purchase",
    "Market run",
    "Urgent item pickup",
    "Gift purchase",
  ],
  "local-information": [
    "Directions help",
    "Nearby contact",
    "Local recommendation",
    "Neighborhood info",
  ],
  "unique-requests": [
    "Portfolio shoot",
    "Creative collaboration",
    "One-time favor",
    "Custom request",
  ],
  "quick-emergency": [
    "Locked out",
    "Immediate contact help",
    "Urgent coordination",
    "Safety support",
  ],
};

let helpingHistoryByUser = {
  "user-demo-1": [
    {
      id: "help-1",
      requestId: "req-5",
      title: "WiFi not working - can someone help troubleshoot?",
      description: "Fixed internet connectivity issue in 15 minutes",
      categorySlug: "tech-help",
      requesterName: "Rahul Sharma",
      requesterAvatar: "RS",
      location: "Connaught Place, Delhi",
      payment: 300,
      karmaEarned: 25,
      completedAt: "2 days ago",
      status: "completed",
      tone: "emerald",
    },
    {
      id: "help-2",
      requestId: "req-2",
      title: "Urgent: Blood donor needed O+ at AIIMS",
      description: "Donated O+ blood at AIIMS for emergency patient",
      categorySlug: "medical-emergency",
      requesterName: "Priya Patel",
      requesterAvatar: "PP",
      location: "AIIMS, Delhi",
      payment: 0,
      karmaEarned: 50,
      completedAt: "1 week ago",
      status: "completed",
      tone: "rose",
    },
  ],
};

let reviewsByUser = {
  "user-demo-1": [
    {
      id: "review-1",
      reviewer: "Priya Patel",
      rating: 5,
      comment:
        "Super helpful and responded immediately. Fixed my WiFi issue in no time. Highly recommend!",
      postedAt: "5 days ago",
    },
    {
      id: "review-2",
      reviewer: "Amit Kumar",
      rating: 5,
      comment:
        "Very genuine person. Helped me push my bike to mechanic without expecting anything. Thanks!",
      postedAt: "1 week ago",
    },
  ],
};

let walletTransactionsByUser = {
  "user-demo-1": [
    {
      id: "wallet-1",
      title: "Earned from fixing leaking tap",
      amount: 500,
      type: "credit",
      status: "Completed",
      postedAt: "2 hours ago",
      fee: 0,
      note: "ID: 1",
      methodLabel: "Task Payout",
    },
    {
      id: "wallet-2",
      title: "Payment for WiFi troubleshooting",
      amount: 520,
      type: "debit",
      status: "Completed",
      postedAt: "Yesterday",
      fee: 20,
      note: "ID: 2",
      methodLabel: "Task Payment",
    },
    {
      id: "wallet-3",
      title: "Added money to wallet",
      amount: 1000,
      type: "credit",
      status: "Completed",
      postedAt: "2 days ago",
      fee: 0,
      note: "ID: 3",
      methodLabel: "UPI",
    },
    {
      id: "wallet-4",
      title: "Earned from helping with flat tyre",
      amount: 300,
      type: "credit",
      status: "Completed",
      postedAt: "3 days ago",
      fee: 0,
      note: "ID: 4",
      methodLabel: "Task Payout",
    },
    {
      id: "wallet-5",
      title: "Payment for photography session",
      amount: 210,
      type: "debit",
      status: "Completed",
      postedAt: "5 days ago",
      fee: 10,
      note: "ID: 5",
      methodLabel: "Task Payment",
    },
    {
      id: "wallet-6",
      title: "Earned from portfolio photography",
      amount: 500,
      type: "credit",
      status: "Completed",
      postedAt: "1 week ago",
      fee: 0,
      note: "ID: 6",
      methodLabel: "Task Payout",
    },
  ],
};

let notificationsByUser = {
  "user-demo-1": [
    {
      id: "notif-1",
      title: "2 new responses on your plumbing request",
      message: "Rahul and Amit are available nearby to help with the leaking tap.",
      tone: "info",
      postedAt: "8 mins ago",
      unread: true,
    },
    {
      id: "notif-2",
      title: "Wallet top-up completed",
      message: "Rs 1000 was added successfully using UPI.",
      tone: "success",
      postedAt: "2 days ago",
      unread: true,
    },
    {
      id: "notif-3",
      title: "Safety desk is ready",
      message: "Use SOS when you need immediate local escalation from verified helpers.",
      tone: "warning",
      postedAt: "Today",
      unread: true,
    },
  ],
};

let requests = [
  {
    id: "req-1",
    title: "Need help fixing leaking tap urgently",
    description:
      "Kitchen tap is leaking badly. Water wastage happening. Need someone who knows basic plumbing.",
    categorySlug: "home-daily",
    urgency: "High",
    tone: "sky",
    requesterName: "Rahul Sharma",
    requesterRating: 4.8,
    requesterVerified: true,
    distanceKm: 0.5,
    postedMinutesAgo: 180,
    responseCount: 3,
    paymentAmount: 200,
    tipLabel: "Rs 50 tip",
    coordinates: { lat: 28.5355, lng: 77.391 },
    helperIds: [],
    createdByUserId: "user-demo-1",
    location: "Connaught Place, Delhi",
  },
  {
    id: "req-2",
    title: "Urgent: Blood donor needed O+ at AIIMS",
    description:
      "Emergency blood requirement for my uncle. O+ blood group. AIIMS Delhi. Please help!",
    categorySlug: "medical-emergency",
    urgency: "Emergency",
    tone: "rose",
    requesterName: "Priya Patel",
    requesterRating: 4.6,
    requesterVerified: true,
    distanceKm: 1.2,
    postedMinutesAgo: 180,
    responseCount: 7,
    paymentAmount: 0,
    tipLabel: "Priority match",
    coordinates: { lat: 28.5672, lng: 77.2101 },
    helperIds: [],
  },
  {
    id: "req-3",
    title: "Need study buddy for tonight - Data Structures exam",
    description:
      "Have exam tomorrow morning. Looking for someone to study with and discuss doubts. Trees and graphs topic.",
    categorySlug: "student-help",
    urgency: "Medium",
    tone: "emerald",
    requesterName: "Amit Kumar",
    requesterRating: 4.5,
    requesterVerified: true,
    distanceKm: 2.3,
    postedMinutesAgo: 240,
    responseCount: 2,
    paymentAmount: 0,
    tipLabel: "Volunteer help",
    coordinates: { lat: 28.6129, lng: 77.2295 },
    helperIds: [],
  },
  {
    id: "req-4",
    title: "Flat tyre near Saket - need push to mechanic",
    description:
      "Bike flat tyre. Mechanic shop is 500m away. Need help pushing the bike.",
    categorySlug: "vehicle-transport",
    urgency: "High",
    tone: "amber",
    requesterName: "Sneha Reddy",
    requesterRating: 4.9,
    requesterVerified: true,
    distanceKm: 0.8,
    postedMinutesAgo: 180,
    responseCount: 1,
    paymentAmount: 150,
    tipLabel: "Rs 100 tip",
    coordinates: { lat: 28.5244, lng: 77.2066 },
    helperIds: [],
  },
  {
    id: "req-5",
    title: "WiFi not working - can someone help troubleshoot?",
    description:
      "Router lights blinking but no internet. Have WFH urgent meeting in 30 mins. Need tech help.",
    categorySlug: "tech-help",
    urgency: "High",
    tone: "teal",
    requesterName: "Rahul Sharma",
    requesterRating: 4.8,
    requesterVerified: true,
    distanceKm: 1.5,
    postedMinutesAgo: 180,
    responseCount: 4,
    paymentAmount: 300,
    tipLabel: "Rs 50 tip",
    coordinates: { lat: 28.4595, lng: 77.0266 },
    helperIds: [],
    createdByUserId: "user-demo-1",
    location: "Connaught Place, Delhi",
  },
  {
    id: "req-6",
    title: "Lost pet dog near Lodhi Garden - URGENT",
    description:
      "My golden retriever ran away 1 hour ago. Last seen near Lodhi Garden gate. Please help find!",
    categorySlug: "pet-animal-help",
    urgency: "Emergency",
    tone: "orange",
    requesterName: "Priya Patel",
    requesterRating: 4.6,
    requesterVerified: true,
    distanceKm: 3.1,
    postedMinutesAgo: 240,
    responseCount: 12,
    paymentAmount: 1000,
    tipLabel: "Rs 1000 reward",
    coordinates: { lat: 28.5933, lng: 77.2197 },
    helperIds: [],
  },
  {
    id: "req-7",
    title: "Need someone to click photos for portfolio",
    description:
      "Amateur photographer. Need someone to take my photos for modeling portfolio. Will take 1 hour max.",
    categorySlug: "unique-requests",
    urgency: "Low",
    tone: "slate",
    requesterName: "Amit Kumar",
    requesterRating: 4.5,
    requesterVerified: true,
    distanceKm: 2.8,
    postedMinutesAgo: 300,
    responseCount: 5,
    paymentAmount: 400,
    tipLabel: "Rs 100 tip",
    coordinates: { lat: 28.6139, lng: 77.209 },
    helperIds: [],
  },
  {
    id: "req-8",
    title: "Locked out of apartment! Need urgent help",
    description:
      "Keys inside house. Locksmith not picking call. Need someone to help me contact landlord or find locksmith.",
    categorySlug: "quick-emergency",
    urgency: "Emergency",
    tone: "indigo",
    requesterName: "Sneha Reddy",
    requesterRating: 4.9,
    requesterVerified: true,
    distanceKm: 1.9,
    postedMinutesAgo: 180,
    responseCount: 6,
    paymentAmount: 250,
    tipLabel: "Rs 50 tip",
    coordinates: { lat: 28.5535, lng: 77.2588 },
    helperIds: [],
  },
];

let requestResponsesById = {
  "req-1": [
    {
      id: "resp-1",
      requestId: "req-1",
      responderId: "helper-amit",
      responderName: "Amit Kumar",
      responderAvatar: "AK",
      responderRating: 4.8,
      responderVerified: true,
      responderKarma: 580,
      postedAt: "10 minutes ago",
      eta: "Available in 30 minutes",
      phone: "+91 98711 22334",
      message:
        "I can help with this. I have plumbing experience and can be there in about 30 minutes.",
      isSelected: false,
      canChat: false,
    },
    {
      id: "resp-2",
      requestId: "req-1",
      responderId: "helper-divya",
      responderName: "Divya Nair",
      responderAvatar: "DN",
      responderRating: 4.7,
      responderVerified: true,
      responderKarma: 320,
      postedAt: "25 minutes ago",
      eta: "Nearby now",
      phone: "+91 98100 44567",
      message:
        "I live nearby and can assist. Let me know the exact location and I will come over.",
      isSelected: false,
      canChat: false,
    },
  ],
  "req-5": [
    {
      id: "resp-3",
      requestId: "req-5",
      responderId: "helper-rahul",
      responderName: "Rahul Singh",
      responderAvatar: "RS",
      responderRating: 4.9,
      responderVerified: true,
      responderKarma: 720,
      postedAt: "5 minutes ago",
      eta: "Available now",
      phone: "+91 98991 11223",
      message:
        "Professional plumber here. I can fix this in 10 minutes and I am available right away.",
      isSelected: false,
      canChat: false,
    },
  ],
};

let conversations = [
  {
    id: "conv-1",
    requestId: "req-1",
    helperId: "helper-amit",
    helperName: "Amit Kumar",
    helperAvatar: "AK",
    requesterId: "user-demo-1",
    requestTitle: "Need help fixing leaking tap urgently",
    preview: "I can help with this. Available in 30 minutes.",
    updatedAt: "2 mins ago",
    unreadCount: 2,
    helperOnline: true,
    messages: [
      {
        id: "msg-1",
        sender: "helper",
        text: "Hi! I saw your request for fixing the tap.",
        time: "10:31 AM",
      },
      {
        id: "msg-2",
        sender: "requester",
        text: "Yes! Thanks for reaching out. Are you available today?",
        time: "10:32 AM",
      },
      {
        id: "msg-3",
        sender: "helper",
        text: "I can come over in about 30 minutes. I live nearby in Koramangala.",
        time: "10:33 AM",
      },
      {
        id: "msg-4",
        sender: "requester",
        text: "Perfect! I will be home. Let me share my exact location.",
        time: "10:34 AM",
      },
      {
        id: "msg-5",
        sender: "helper",
        text: "Great! I will bring my tools. Should be quick to fix.",
        time: "10:35 AM",
      },
    ],
  },
];

function cloneStateValue(value) {
  return JSON.parse(JSON.stringify(value));
}

export function hydrateState(payload = {}) {
  users = cloneStateValue(payload.users || users);
  helpingHistoryByUser = cloneStateValue(
    payload.helpingHistoryByUser || helpingHistoryByUser
  );
  reviewsByUser = cloneStateValue(payload.reviewsByUser || reviewsByUser);
  walletTransactionsByUser = cloneStateValue(
    payload.walletTransactionsByUser || walletTransactionsByUser
  );
  notificationsByUser = cloneStateValue(
    payload.notificationsByUser || notificationsByUser
  );
  requests = cloneStateValue(payload.requests || requests);
  requestResponsesById = cloneStateValue(
    payload.requestResponsesById || requestResponsesById
  );
  conversations = cloneStateValue(payload.conversations || conversations);
}

export function getPersistableState() {
  return cloneStateValue({
    users,
    helpingHistoryByUser,
    reviewsByUser,
    walletTransactionsByUser,
    notificationsByUser,
    requests,
    requestResponsesById,
    conversations,
  });
}

async function persistCurrentState() {
  await persistState(getPersistableState());
}

function getJwtSecret() {
  return process.env.JWT_SECRET || "needhelp-dev-secret-change-me";
}

export async function ensureSecurityState() {
  let didChange = false;

  for (const user of users) {
    if (!isPasswordHashed(user.password)) {
      user.password = await hashPassword(user.password);
      didChange = true;
    }
  }

  if (didChange) {
    await persistCurrentState();
  }
}

function sendJson(response, statusCode, payload) {
  if (typeof response.status === "function") {
    response.status(statusCode).json(payload);
    return;
  }

  if (typeof response.writeHead === "function" && typeof response.end === "function") {
    response.writeHead(statusCode, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify(payload));
    return;
  }

  throw new Error("Unsupported response object.");
}

function sendEmptyStatus(response, statusCode) {
  if (typeof response.sendStatus === "function") {
    response.sendStatus(statusCode);
    return;
  }

  if (typeof response.writeHead === "function" && typeof response.end === "function") {
    response.writeHead(statusCode);
    response.end();
    return;
  }

  throw new Error("Unsupported response object.");
}

function readJsonBody(request) {
  return Promise.resolve(request.body || {});
}

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function isPasswordHashed(password = "") {
  return typeof password === "string" && password.startsWith(passwordHashPrefix);
}

async function hashPassword(password = "") {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password = "", passwordHash = "") {
  if (!passwordHash) {
    return false;
  }

  if (!isPasswordHashed(passwordHash)) {
    return password === passwordHash;
  }

  return bcrypt.compare(password, passwordHash);
}

function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

function isStrongPassword(password = "") {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

function isValidPhone(phone = "") {
  return /^\+?\d[\d\s-]{8,}$/.test(phone.trim());
}

function findUserByEmail(email = "") {
  const normalizedEmail = normalizeEmail(email);
  return users.find((user) => user.email === normalizedEmail);
}

function findUserById(userId = "") {
  return users.find((user) => user.id === userId);
}

async function findOrCreateSocialUser(provider = "") {
  const normalizedProvider = provider.trim().toLowerCase();
  const socialEmail = `${normalizedProvider}.user@needhelp.local`;
  let user = findUserByEmail(socialEmail);

  if (user) {
    return user;
  }

  user = {
    id: `user-${Date.now()}`,
    email: socialEmail,
    password: await hashPassword(`NeedHelp${formatProviderName(normalizedProvider)}123`),
    name: `${formatProviderName(normalizedProvider)} Neighbor`,
    phone: "+91 98765 43210",
    address: "Connaught Place, Delhi",
    walletBalance: 500,
    karmaPoints: 40,
    notificationCount: 0,
    sosActive: false,
    overallRating: 5,
    tasksCompleted: 0,
    helpRequested: 0,
  };

  users.push(user);
  return user;
}

function getWalletTransactions(userId = "") {
  if (!walletTransactionsByUser[userId]) {
    walletTransactionsByUser[userId] = [];
  }

  return walletTransactionsByUser[userId];
}

function getNotifications(userId = "") {
  if (!notificationsByUser[userId]) {
    notificationsByUser[userId] = [];
  }

  return notificationsByUser[userId];
}

function buildDemoPaymentSimulation(method, amount, processingFee, outcome) {
  const normalizedOutcome = demoSimulationLabels[outcome] ? outcome : "success";
  const methodLabel =
    method === "card"
      ? "Credit/Debit Card"
      : method === "netbanking"
        ? "Net Banking"
        : method === "needhelp-wallet"
          ? "NeedHelp Wallet"
          : "UPI";
  const timestamp = Date.now();

  return {
    status: normalizedOutcome,
    label: demoSimulationLabels[normalizedOutcome],
    methodLabel,
    gatewayReference: `SIM-GW-${timestamp}`,
    transactionId: `SIM-TXN-${timestamp}`,
    amount,
    processingFee,
    totalCharge: amount + processingFee,
    isSandbox: true,
    message:
      normalizedOutcome === "failed"
        ? "The payment could not be completed. Please try again."
        : normalizedOutcome === "pending"
          ? "Your payment is being processed. Confirmation may take a little longer."
          : "Your payment was completed successfully.",
    processedAt: new Date(timestamp).toISOString(),
  };
}

function syncNotificationCount(user) {
  user.notificationCount = getNotifications(user.id).filter(
    (notification) => notification.unread
  ).length;
  return user.notificationCount;
}

function addNotification(user, notification) {
  const notifications = getNotifications(user.id);

  notifications.unshift({
    id: `notif-${Date.now()}-${notifications.length + 1}`,
    title: notification.title,
    message: notification.message,
    tone: notification.tone || "info",
    postedAt: notification.postedAt || "Just now",
    unread: true,
  });

  syncNotificationCount(user);
}

function createSessionToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    getJwtSecret(),
    {
      expiresIn: "12h",
      issuer: authTokenIssuer,
      audience: authTokenAudience,
    }
  );
}

function buildUserPayload(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    walletBalance: user.walletBalance,
    karmaPoints: user.karmaPoints,
    notificationCount: getNotifications(user.id).filter((item) => item.unread).length,
    sosActive: Boolean(user.sosActive),
    overallRating: user.overallRating,
    tasksCompleted: user.tasksCompleted,
    helpRequested: user.helpRequested,
  };
}

function buildAuthResponse(user, message) {
  return {
    message,
    token: createSessionToken(user),
    user: buildUserPayload(user),
  };
}

function formatProviderName(provider) {
  return `${provider[0].toUpperCase()}${provider.slice(1)}`;
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDistance(distanceKm) {
  return `${distanceKm.toFixed(1)} km`;
}

function formatPostedTime(minutesAgo) {
  if (minutesAgo >= 60) {
    return `${Math.floor(minutesAgo / 60)}h ago`;
  }

  return `${minutesAgo}m ago`;
}

function getUserBadges(user) {
  const badges = ["Trusted Member"];

  if (Number(user.tasksCompleted || 0) > 0) {
    badges.unshift("Verified Helper");
  }

  if (Number(user.karmaPoints || 0) >= 250) {
    badges.push("Fast Responder");
  }

  return badges;
}

function ensureConversationMetadata(conversation) {
  if (!Array.isArray(conversation.starredBy)) {
    conversation.starredBy = [];
  }

  if (!Array.isArray(conversation.mutedBy)) {
    conversation.mutedBy = [];
  }

  return conversation;
}

function readAuthorizedUser(request) {
  const authorization = request.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret(), {
      issuer: authTokenIssuer,
      audience: authTokenAudience,
    });

    const userId = typeof payload.sub === "string" ? payload.sub : "";

    if (!userId) {
      return null;
    }

    return findUserById(userId) || null;
  } catch {
    return null;
  }
}

function requireAuth(request, response) {
  const user = readAuthorizedUser(request);

  if (!user) {
    sendJson(response, 401, {
      message: "Your session has expired. Please sign in again.",
    });
    return null;
  }

  return user;
}

function getCategoryLabel(categorySlug) {
  return (
    categoryCatalog.find((category) => category.slug === categorySlug)?.label ||
    "Community Help"
  );
}

function buildCategoryMeta(allRequests) {
  return categoryCatalog.map((category) => ({
    ...category,
    count: allRequests.filter((requestItem) => requestItem.categorySlug === category.slug)
      .length,
  }));
}

function buildRequestFormPayload(user) {
  return {
    categories: categoryCatalog.map((category) => ({
      ...category,
      specificNeeds: categorySpecificNeeds[category.slug] || [],
    })),
    urgencies: [
      {
        value: "Emergency",
        description: "Life-threatening, need immediate help",
      },
      {
        value: "High",
        description: "Need help within next few hours",
      },
      {
        value: "Medium",
        description: "Can wait till today or tomorrow",
      },
      {
        value: "Low",
        description: "Flexible timing",
      },
    ],
    defaults: {
      location: "Connaught Place, Delhi",
      rewardText: "",
    },
    billing: {
      platformFeeRate,
      flatPlatformFee,
    },
    user: buildUserPayload(user),
  };
}

function buildProfilePayload(user, viewer = user) {
  const myRequests = sortRequests(
    requests.filter((requestItem) => requestItem.createdByUserId === user.id)
  ).map((requestItem) => ({
    id: requestItem.id,
    requestId: requestItem.id,
    title: requestItem.title,
    description: requestItem.description,
    categorySlug: requestItem.categorySlug,
    category: getCategoryLabel(requestItem.categorySlug),
    urgency: requestItem.urgency,
    location: requestItem.location,
    payment: requestItem.paymentAmount,
    responseCount: requestItem.responseCount,
    postedAt: formatPostedTime(requestItem.postedMinutesAgo),
    status: requestItem.status || "active",
    tone: requestItem.tone,
  }));

  const helpingHistory = [
    ...conversations
      .filter((conversation) => conversation.helperId === user.id)
      .map((conversation) => {
        const requestItem = findRequestById(conversation.requestId);

        if (!requestItem) {
          return null;
        }

        return {
          id: conversation.id,
          requestId: requestItem.id,
          title: requestItem.title,
          description: requestItem.description,
          categorySlug: requestItem.categorySlug,
          category: getCategoryLabel(requestItem.categorySlug),
          urgency: requestItem.urgency,
          location: requestItem.location,
          payment: requestItem.paymentAmount,
          requesterName: requestItem.requesterName,
          requesterAvatar: getInitials(requestItem.requesterName),
          status: "accepted",
          acceptedDate: conversation.updatedAt,
        };
      })
      .filter(Boolean),
    ...(helpingHistoryByUser[user.id] || []).map((item) => ({
      ...item,
      requestId: item.requestId || item.id,
      category: item.categorySlug ? getCategoryLabel(item.categorySlug) : "Community Help",
      status: item.status || "completed",
      requesterAvatar: item.requesterAvatar || getInitials(item.requesterName || "NH"),
      acceptedDate: item.acceptedDate || item.completedAt,
    })),
  ];
  const reviews = reviewsByUser[user.id] || [];
  const nextLevelPoints = 500;
  const pointsToNextLevel = Math.max(nextLevelPoints - user.karmaPoints, 0);

  return {
    user: buildUserPayload(user),
    isOwnProfile: viewer?.id === user.id,
    badges: getUserBadges(user),
    stats: [
      { label: "Overall Rating", value: String(user.overallRating), tone: "sky" },
      { label: "Tasks Completed", value: String(user.tasksCompleted), tone: "emerald" },
      { label: "Help Requested", value: String(user.helpRequested), tone: "indigo" },
      { label: "Karma Points", value: String(user.karmaPoints), tone: "amber" },
    ],
    karma: {
      currentPoints: user.karmaPoints,
      nextLevelPoints,
      pointsToNextLevel,
      tips: [
        "Complete a task: +20 points",
        "Get 5 star rating: +10 bonus points",
        "Respond within 5 mins: +5 points",
        "Emergency help: +30 points",
      ],
    },
    tabs: {
      myRequests,
      helpingHistory,
      reviews,
    },
  };
}

function buildWalletTransactionPayload(transaction) {
  return {
    id: transaction.id,
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type,
    status: transaction.status,
    postedAt: transaction.postedAt,
    fee: transaction.fee || 0,
    note: transaction.note || "",
    methodLabel: transaction.methodLabel || "",
  };
}

function buildWalletPayload(user) {
  const transactions = getWalletTransactions(user.id);
  const totalEarned = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalSpent = transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const platformFees = transactions.reduce(
    (sum, transaction) => sum + (transaction.fee || 0),
    0
  );

  return {
    user: buildUserPayload(user),
    overview: {
      balance: user.walletBalance,
      totalEarned,
      totalSpent,
      platformFees,
    },
    feeInfo: {
      description:
        "We charge 2% plus Rs 5 per transaction to keep the platform fast, safe, and reliable.",
      platformFeeRate,
      flatPlatformFee,
      highlights: ["Fair pricing", "Secure payments", "Instant transfers"],
    },
    paymentSimulation: {
      enabled: true,
      description:
        "Wallet payments support UPI, cards, net banking, and wallet balance for quick top-ups.",
      supportedOutcomes: ["success", "pending", "failed"],
    },
    transactions: transactions.map((transaction) =>
      buildWalletTransactionPayload(transaction)
    ),
    recentTransactions: transactions.slice(0, 3).map((transaction) =>
      buildWalletTransactionPayload(transaction)
    ),
  };
}

function buildNotificationsPayload(user) {
  const notifications = getNotifications(user.id);

  return {
    user: buildUserPayload(user),
    unreadCount: notifications.filter((item) => item.unread).length,
    notifications,
  };
}

function getRequestResponses(requestId = "") {
  if (!requestResponsesById[requestId]) {
    requestResponsesById[requestId] = [];
  }

  return requestResponsesById[requestId];
}

function findConversationByRequestAndHelper(requestId = "", helperId = "") {
  return conversations.find(
    (conversation) =>
      conversation.requestId === requestId && conversation.helperId === helperId
  );
}

function buildRequestDetailPayload(requestItem, user) {
  const responses = getRequestResponses(requestItem.id);
  const requestOwner = findUserById(requestItem.createdByUserId) || user;
  const selectedResponse =
    responses.find((response) => response.responderId === user.id) || null;
  const activeConversation = selectedResponse
    ? findConversationByRequestAndHelper(requestItem.id, user.id)
    : null;

  return {
    request: {
      ...buildRequestPayload(requestItem, user),
      location: requestItem.location || "Nearby",
      specificNeed: requestItem.specificNeed || "",
      fullDescription: requestItem.description,
      postedLabel: formatPostedTime(requestItem.postedMinutesAgo),
      responsesCount: responses.length,
      status: selectedResponse ? "In Progress" : "Open",
      coordinates: requestItem.coordinates || buildCoordinatesNearDelhi(),
    },
    postedBy: {
      id: requestOwner.id || requestItem.createdByUserId || "",
      name: requestOwner.name || requestItem.requesterName,
      avatar: getInitials(requestOwner.name || requestItem.requesterName),
      phone: requestOwner.phone || "+91 98765 43210",
      rating: Number(requestOwner.overallRating || requestItem.requesterRating || 4.8).toFixed(1),
      karmaPoints: requestOwner.karmaPoints || 450,
      responseRate: "95%",
      averageResponseTime: "12 mins",
      memberSince: "Jan 2025",
      badges: ["Verified Helper", "Fast Responder"],
    },
    safetyTips: [
      "Verify the other person's identity before meeting",
      "Meet in public places when possible",
      "Trust your instincts",
      "Report suspicious behavior",
    ],
    responses,
    activeConversation: activeConversation
      ? {
          id: activeConversation.id,
          helperName: requestOwner.name || requestItem.requesterName,
          helperAvatar: getInitials(requestOwner.name || requestItem.requesterName),
          note: "Task in progress. Continue the coordination here.",
          phone: requestOwner.phone || "+91 98765 43210",
        }
      : null,
    hasResponded: Boolean(selectedResponse),
  };
}

function buildConversationPayload(conversation, user) {
  ensureConversationMetadata(conversation);
  const requestItem = findRequestById(conversation.requestId);
  const requestOwner = requestItem
    ? findUserById(requestItem.createdByUserId) || {
        id: conversation.requesterId,
        name: requestItem.requesterName,
        phone: "+91 98765 43210",
      }
    : {
        id: conversation.requesterId,
        name: "Requester",
        phone: "+91 98765 43210",
      };
  const isHelperViewer = user?.id === conversation.helperId;
  const counterpartName = isHelperViewer
    ? requestOwner.name
    : conversation.helperName;
  const counterpartAvatar = isHelperViewer
    ? getInitials(requestOwner.name)
    : conversation.helperAvatar;
  const counterpartPhone = isHelperViewer
    ? requestOwner.phone || "+91 98765 43210"
    : conversation.helperPhone || "+91 98765 43210";
  const counterpartUserId = isHelperViewer
    ? requestOwner.id || conversation.requesterId
    : conversation.helperId;

  return {
    id: conversation.id,
    requestId: conversation.requestId,
    helperName: counterpartName,
    helperAvatar: counterpartAvatar,
    requestTitle: conversation.requestTitle,
    preview: conversation.preview,
    updatedAt: conversation.updatedAt,
    unreadCount: conversation.unreadCount,
    helperOnline: conversation.helperOnline,
    messages: conversation.messages,
    contactPhone: counterpartPhone,
    contactRole: isHelperViewer ? "requester" : "helper",
    counterpartUserId,
    isStarred: conversation.starredBy.includes(user.id),
    isMuted: conversation.mutedBy.includes(user.id),
  };
}

function buildCoordinatesNearDelhi() {
  const baseLat = 28.6139;
  const baseLng = 77.209;

  return {
    lat: Number((baseLat + (Math.random() - 0.5) * 0.06).toFixed(4)),
    lng: Number((baseLng + (Math.random() - 0.5) * 0.06).toFixed(4)),
  };
}

function buildDescriptionSuggestion({
  title,
  description,
  location,
  urgency,
  categorySlug,
  specificNeed,
}) {
  const cleanedTitle = title.trim();
  const cleanedDescription = description.trim();
  const cleanedLocation = location.trim();
  const categoryLabel = getCategoryLabel(categorySlug);
  const urgencyText = urgency ? `${urgency.toLowerCase()} priority` : "local";
  const needText = specificNeed ? `${specificNeed.toLowerCase()} request` : categoryLabel.toLowerCase();

  if (cleanedDescription.length >= 60) {
    const sentences = [
      cleanedDescription.replace(/\s+/g, " ").trim(),
    ];

    if (cleanedLocation && !cleanedDescription.toLowerCase().includes(cleanedLocation.toLowerCase())) {
      sentences.push(`Location: ${cleanedLocation}.`);
    }

    if (urgency && !cleanedDescription.toLowerCase().includes(urgency.toLowerCase())) {
      sentences.push(`This is a ${urgencyText} request.`);
    }

    sentences.push("Looking for a nearby verified helper who can respond soon.");
    return sentences.join(" ");
  }

  return [
    `Need help with ${cleanedTitle ? cleanedTitle.toLowerCase() : needText}.`,
    cleanedLocation ? `Location: ${cleanedLocation}.` : "",
    `This is a ${urgencyText} request and I am looking for someone nearby who can help.`,
    "Please respond if you have relevant experience or are available soon.",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildTitleSuggestion({ title, specificNeed, categorySlug, urgency }) {
  const cleanedTitle = title.trim();
  const base = cleanedTitle || specificNeed || getCategoryLabel(categorySlug);

  if (!base) {
    return "Need nearby help";
  }

  const normalizedBase =
    base.charAt(0).toUpperCase() + base.slice(1).replace(/\s+/g, " ").trim();

  if (urgency === "Emergency") {
    return `Urgent help needed: ${normalizedBase}`;
  }

  if (urgency === "High") {
    return `${normalizedBase} needed today`;
  }

  return normalizedBase;
}

function requestMatchesFilters(requestItem, filters) {
  const query = (filters.query || "").trim().toLowerCase();
  const category = (filters.category || "").trim().toLowerCase();
  const urgency = (filters.urgency || "").trim().toLowerCase();

  if (query) {
    const haystack = [
      requestItem.title,
      requestItem.description,
      requestItem.requesterName,
      getCategoryLabel(requestItem.categorySlug),
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(query)) {
      return false;
    }
  }

  if (category && category !== "all" && requestItem.categorySlug !== category) {
    return false;
  }

  if (
    urgency &&
    urgency !== "all" &&
    requestItem.urgency.toLowerCase() !== urgency
  ) {
    return false;
  }

  return true;
}

function sortRequests(requestList) {
  return [...requestList].sort((left, right) => {
    const urgencyDifference =
      urgencyRank[left.urgency] - urgencyRank[right.urgency];

    if (urgencyDifference !== 0) {
      return urgencyDifference;
    }

    return left.postedMinutesAgo - right.postedMinutesAgo;
  });
}

function buildRequestPayload(requestItem, user) {
  return {
    id: requestItem.id,
    title: requestItem.title,
    description: requestItem.description,
    category: getCategoryLabel(requestItem.categorySlug),
    categorySlug: requestItem.categorySlug,
    urgency: requestItem.urgency,
    tone: requestItem.tone,
    requester: requestItem.requesterName,
    rating: requestItem.requesterRating.toFixed(1),
    requesterVerified: requestItem.requesterVerified,
    distance: formatDistance(requestItem.distanceKm),
    posted: formatPostedTime(requestItem.postedMinutesAgo),
    chats: String(requestItem.responseCount),
    payment: requestItem.paymentAmount > 0 ? `Rs ${requestItem.paymentAmount}` : "Community task",
    paymentAmount: requestItem.paymentAmount,
    tip: requestItem.tipLabel,
    avatar: getInitials(requestItem.requesterName),
    coordinates: requestItem.coordinates,
    isHelping: requestItem.helperIds.includes(user.id),
    helperCount: requestItem.helperIds.length,
  };
}

function buildBrowseResponse(user, filters = {}) {
  const filteredRequests = sortRequests(
    requests.filter((requestItem) => requestMatchesFilters(requestItem, filters))
  );

  return {
    count: filteredRequests.length,
    requests: filteredRequests.map((requestItem) =>
      buildRequestPayload(requestItem, user)
    ),
    categories: buildCategoryMeta(requests),
    urgencies: ["Emergency", "High", "Medium", "Low"],
    summary: communitySummary,
  };
}

function findRequestById(requestId = "") {
  return requests.find((requestItem) => requestItem.id === requestId);
}

function findConversationById(conversationId = "") {
  return conversations.find((conversation) => conversation.id === conversationId);
}

function getActionMessage(action, requestItem) {
  if (action === "chat") {
    return `Chat started for "${requestItem.title}".`;
  }

  return `You are now responding to "${requestItem.title}".`;
}

function handleProtectedBrowseRequest(request, response) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  const requestUrl = new URL(
    request.originalUrl || request.url || request.path,
    "http://localhost"
  );
  const payload = buildBrowseResponse(user, {
    query: requestUrl.searchParams.get("query") || "",
    category: requestUrl.searchParams.get("category") || "",
    urgency: requestUrl.searchParams.get("urgency") || "",
  });

  sendJson(response, 200, payload);
  return true;
}

async function handleRequestAction(request, response, action, requestId) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  const requestItem = findRequestById(requestId);

  if (!requestItem) {
    sendJson(response, 404, {
      message: "Request not found.",
    });
    return true;
  }

  if (action === "help" && !requestItem.helperIds.includes(user.id)) {
    requestItem.helperIds.push(user.id);
    user.karmaPoints += requestItem.paymentAmount > 0 ? 15 : 10;
    addNotification(user, {
      title: "You joined a request",
      message: `You are now responding to "${requestItem.title}".`,
      tone: "success",
    });

    await persistCurrentState();
  }

  sendJson(response, 200, {
    message: getActionMessage(action, requestItem),
    request: buildRequestPayload(requestItem, user),
    user: buildUserPayload(user),
  });
  return true;
}

async function handleRequestResponseSubmit(request, response, requestId) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  const requestItem = findRequestById(requestId);

  if (!requestItem) {
    sendJson(response, 404, {
      message: "Request not found.",
    });
    return true;
  }

  try {
    const { message = "" } = await readJsonBody(request);
    const normalizedMessage = message.trim();

    if (!normalizedMessage) {
      sendJson(response, 400, {
        message: "Please enter a message",
      });
      return true;
    }

    const responses = getRequestResponses(requestId);
    const existingResponse = responses.find(
      (responseItem) => responseItem.responderId === user.id
    );

    if (!existingResponse) {
      const newResponse = {
        id: `resp-${Date.now()}`,
        requestId,
        responderId: user.id,
        responderName: user.name,
        responderAvatar: getInitials(user.name),
        responderRating: Number(user.overallRating || 4.8).toFixed(1),
        responderVerified: true,
        responderKarma: user.karmaPoints,
        postedAt: "Just now",
        eta: "Available soon",
        phone: user.phone,
        message: normalizedMessage,
        isSelected: true,
        canChat: true,
      };

      responses.unshift(newResponse);
      requestItem.responseCount = responses.length;

      const otherResponses = responses.filter(
        (responseItem) => responseItem.id !== newResponse.id
      );
      otherResponses.forEach((responseItem) => {
        responseItem.isSelected = false;
        responseItem.canChat = false;
      });

      let conversation = findConversationByRequestAndHelper(requestId, user.id);

      if (!conversation) {
        conversation = {
          id: `conv-${Date.now()}`,
          requestId,
          helperId: user.id,
          helperName: user.name,
          helperAvatar: getInitials(user.name),
          helperPhone: user.phone,
          requesterId: requestItem.createdByUserId || "user-demo-1",
          requestTitle: requestItem.title,
          preview: normalizedMessage,
          updatedAt: "Just now",
          unreadCount: 1,
          helperOnline: true,
          messages: [
            {
              id: `msg-${Date.now()}-1`,
              sender: "helper",
              text: normalizedMessage,
              time: "Now",
            },
            {
              id: `msg-${Date.now()}-2`,
              sender: "requester",
              text: "Thanks for responding. I saw your message and will continue here in chat.",
              time: "Now",
            },
          ],
        };

        conversations.unshift(conversation);
      }

      addNotification(user, {
        title: "Response sent",
        message: `Your response to "${requestItem.title}" was sent successfully.`,
        tone: "success",
      });

      await persistCurrentState();
    }

    sendJson(response, 200, {
      message: "Response sent!",
      detail: buildRequestDetailPayload(requestItem, user),
      user: buildUserPayload(user),
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error.message || "Unable to send your response right now.",
    });
  }

  return true;
}

async function handleMessagesFetch(request, response) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  const userConversations = conversations.filter(
    (conversation) =>
      conversation.helperId === user.id || conversation.requesterId === user.id
  );

  sendJson(response, 200, {
    conversations: userConversations.map((conversation) =>
      buildConversationPayload(conversation, user)
    ),
    selectedConversationId: userConversations[0]?.id || "",
    user: buildUserPayload(user),
  });
  return true;
}

async function handleMessageSend(request, response, conversationId) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  const conversation = findConversationById(conversationId);

  if (!conversation) {
    sendJson(response, 404, {
      message: "Conversation not found.",
    });
    return true;
  }

  try {
    const { text = "" } = await readJsonBody(request);
    const normalizedText = text.trim();

    if (!normalizedText) {
      sendJson(response, 400, {
        message: "Please enter a message before sending.",
      });
      return true;
    }

    const sender =
      conversation.helperId === user.id ? "helper" : "requester";

    conversation.messages.push({
      id: `msg-${Date.now()}`,
      sender,
      text: normalizedText,
      time: "Now",
    });
    conversation.preview = normalizedText;
    conversation.updatedAt = "Just now";

    const shouldAutoReply = conversation.messages.length < 14;

    if (shouldAutoReply) {
      const autoReplyText =
        sender === "helper"
          ? "Thanks, I have seen your update. Share the exact landmark if needed and I will stay available here."
          : "Got it. I am on my way and will keep you updated here.";

      conversation.messages.push({
        id: `msg-${Date.now()}-auto`,
        sender: sender === "helper" ? "requester" : "helper",
        text: autoReplyText,
        time: "Now",
      });
    }

    await persistCurrentState();

    sendJson(response, 200, {
      message: "Message sent.",
      conversation: buildConversationPayload(conversation, user),
      user: buildUserPayload(user),
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error.message || "Unable to send this message right now.",
    });
  }

  return true;
}

async function handleConversationPreferenceUpdate(request, response, conversationId) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  const conversation = findConversationById(conversationId);

  if (!conversation) {
    sendJson(response, 404, {
      message: "Conversation not found.",
    });
    return true;
  }

  ensureConversationMetadata(conversation);

  try {
    const { starred, muted } = await readJsonBody(request);

    if (typeof starred === "boolean") {
      conversation.starredBy = starred
        ? Array.from(new Set([...conversation.starredBy, user.id]))
        : conversation.starredBy.filter((item) => item !== user.id);
    }

    if (typeof muted === "boolean") {
      conversation.mutedBy = muted
        ? Array.from(new Set([...conversation.mutedBy, user.id]))
        : conversation.mutedBy.filter((item) => item !== user.id);
    }

    await persistCurrentState();

    sendJson(response, 200, {
      message: "Conversation settings updated.",
      conversation: buildConversationPayload(conversation, user),
      user: buildUserPayload(user),
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error.message || "Unable to update conversation settings.",
    });
  }

  return true;
}

async function handleProfileUpdate(request, response) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  try {
    const { name = "", phone = "", address = "" } = await readJsonBody(request);
    const normalizedName = name.trim();
    const normalizedPhone = phone.trim();
    const normalizedAddress = address.trim();

    if (!normalizedName) {
      sendJson(response, 400, { message: "Name is required." });
      return true;
    }

    if (!isValidPhone(normalizedPhone)) {
      sendJson(response, 400, { message: "Please enter a valid phone number." });
      return true;
    }

    if (!normalizedAddress) {
      sendJson(response, 400, { message: "Address is required." });
      return true;
    }

    user.name = normalizedName;
    user.phone = normalizedPhone;
    user.address = normalizedAddress;

    requests.forEach((requestItem) => {
      if (requestItem.createdByUserId === user.id) {
        requestItem.requesterName = normalizedName;
        requestItem.location = normalizedAddress;
      }
    });

    Object.values(requestResponsesById).forEach((responses) => {
      responses.forEach((responseItem) => {
        if (responseItem.responderId === user.id) {
          responseItem.responderName = normalizedName;
          responseItem.responderAvatar = getInitials(normalizedName);
          responseItem.phone = normalizedPhone;
        }
      });
    });

    conversations.forEach((conversation) => {
      if (conversation.helperId === user.id) {
        conversation.helperName = normalizedName;
        conversation.helperAvatar = getInitials(normalizedName);
        conversation.helperPhone = normalizedPhone;
      }
    });

    await persistCurrentState();

    sendJson(response, 200, {
      message: "Profile updated successfully.",
      profile: buildProfilePayload(user),
      user: buildUserPayload(user),
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error.message || "Unable to update profile right now.",
    });
  }

  return true;
}

async function handlePublicProfileFetch(request, response, userId) {
  const viewer = requireAuth(request, response);

  if (!viewer) {
    return true;
  }

  const profileUser = findUserById(userId);

  if (!profileUser) {
    sendJson(response, 404, { message: "Profile not found." });
    return true;
  }

  sendJson(response, 200, {
    ...buildProfilePayload(profileUser, viewer),
    viewer: buildUserPayload(viewer),
  });
  return true;
}

async function handlePasswordReset(request, response) {
  try {
    const { email = "", password = "", confirmPassword = "" } =
      await readJsonBody(request);
    const normalizedEmail = normalizeEmail(email);
    const user = findUserByEmail(normalizedEmail);

    if (!user) {
      sendJson(response, 404, {
        message: "No account found for that email address.",
      });
      return true;
    }

    if (password !== confirmPassword) {
      sendJson(response, 400, {
        message: "Password and confirm password must match.",
      });
      return true;
    }

    if (!isStrongPassword(password)) {
      sendJson(response, 400, {
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      });
      return true;
    }

    user.password = await hashPassword(password);
    await persistCurrentState();

    sendJson(response, 200, {
      message: "Password reset successfully. You can sign in now.",
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error.message || "Unable to reset password right now.",
    });
  }

  return true;
}

async function handleCreateRequest(request, response) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  try {
    const {
      title = "",
      description = "",
      manualAddress = "",
      location = "",
      categorySlug = "",
      specificNeed = "",
      urgency = "",
      rewardText = "",
      paymentEnabled = false,
      paymentAmount = 0,
      coordinates = null,
    } = await readJsonBody(request);

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedManualAddress = manualAddress.trim();
    const normalizedLocation = location.trim();
    const normalizedCategorySlug = categorySlug.trim();
    const normalizedUrgency = urgency.trim();
    const normalizedSpecificNeed = specificNeed.trim();
    const normalizedRewardText = rewardText.trim();
    const parsedPaymentAmount = Number(paymentAmount) || 0;
    const hasPayment = Boolean(paymentEnabled);
    const validCoordinates =
      coordinates &&
      typeof coordinates.lat === "number" &&
      typeof coordinates.lng === "number"
        ? {
            lat: Number(coordinates.lat.toFixed(4)),
            lng: Number(coordinates.lng.toFixed(4)),
          }
        : null;

    if (!normalizedTitle || !normalizedDescription || !normalizedLocation) {
      sendJson(response, 400, {
        message: "Title, description, and location are required.",
      });
      return true;
    }

    if (
      normalizedDescription.length < 30 ||
      normalizedDescription.length > 500
    ) {
      sendJson(response, 400, {
        message: "Description should be between 30 and 500 characters.",
      });
      return true;
    }

    if (!categoryCatalog.some((category) => category.slug === normalizedCategorySlug)) {
      sendJson(response, 400, {
        message: "Please select a valid category.",
      });
      return true;
    }

    if (!["Emergency", "High", "Medium", "Low"].includes(normalizedUrgency)) {
      sendJson(response, 400, {
        message: "Please choose a valid urgency level.",
      });
      return true;
    }

    const specificNeedOptions = categorySpecificNeeds[normalizedCategorySlug] || [];

    if (
      normalizedSpecificNeed &&
      !specificNeedOptions.includes(normalizedSpecificNeed)
    ) {
      sendJson(response, 400, {
        message: "Please choose a valid specific need option.",
      });
      return true;
    }

    let platformFee = 0;
    let totalCharge = 0;

    if (hasPayment) {
      if (parsedPaymentAmount < 50) {
        sendJson(response, 400, {
          message: "Payment amount must be at least Rs 50.",
        });
        return true;
      }

      platformFee =
        Math.round(parsedPaymentAmount * platformFeeRate) + flatPlatformFee;
      totalCharge = parsedPaymentAmount + platformFee;

      if (user.walletBalance < totalCharge) {
        sendJson(response, 400, {
          message: `You need Rs ${totalCharge} in your wallet to post this paid request.`,
        });
        return true;
      }

      user.walletBalance -= totalCharge;

      getWalletTransactions(user.id).unshift({
        id: `wallet-${Date.now()}`,
        title: `Payment for ${normalizedTitle}`,
        amount: totalCharge,
        type: "debit",
        status: "Completed",
        postedAt: "Just now",
        fee: platformFee,
        note: "Paid request",
        methodLabel: "Request Payment",
      });
    }

    user.helpRequested += 1;

    addNotification(user, {
      title: "Request posted successfully",
      message: `"${normalizedTitle}" is now live in the community feed.`,
      tone: "success",
    });

    const requestItem = {
      id: `req-${Date.now()}`,
      title: normalizedTitle,
      description: normalizedDescription,
      categorySlug: normalizedCategorySlug,
      urgency: normalizedUrgency,
      tone:
        {
          "home-daily": "sky",
          "vehicle-transport": "amber",
          "medical-emergency": "rose",
          "delivery-pickup": "amber",
          "student-help": "emerald",
          "pet-animal-help": "orange",
          "personal-help": "sky",
          "event-social": "indigo",
          "skill-based-help": "slate",
          "tech-help": "teal",
          "shopping-help": "amber",
          "local-information": "sky",
          "unique-requests": "slate",
          "quick-emergency": "indigo",
        }[normalizedCategorySlug] || "sky",
      requesterName: user.name,
      requesterRating: 4.9,
      requesterVerified: true,
      distanceKm: 0.2,
      postedMinutesAgo: 2,
      responseCount: 0,
      paymentAmount: hasPayment ? parsedPaymentAmount : 0,
      tipLabel:
        normalizedRewardText ||
        (hasPayment ? `Rs ${parsedPaymentAmount} reward` : "Be the first to respond"),
      coordinates: validCoordinates || buildCoordinatesNearDelhi(),
      helperIds: [],
      location: normalizedManualAddress || normalizedLocation,
      specificNeed: normalizedSpecificNeed,
      createdByUserId: user.id,
    };

    requests.unshift(requestItem);

    await persistCurrentState();

    sendJson(response, 201, {
      message: "Your request is now live in the community feed.",
      request: buildRequestPayload(requestItem, user),
      user: buildUserPayload(user),
      billing: {
        paymentEnabled: hasPayment,
        taskAmount: hasPayment ? parsedPaymentAmount : 0,
        platformFee,
        totalCharge,
      },
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error.message || "Unable to create your request right now.",
    });
  }

  return true;
}

async function handleRequestManage(request, response, requestId, action) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  const requestItem = findRequestById(requestId);

  if (!requestItem) {
    sendJson(response, 404, { message: "Request not found." });
    return true;
  }

  if (requestItem.createdByUserId !== user.id) {
    sendJson(response, 403, {
      message: "You can only manage requests you created.",
    });
    return true;
  }

  if (action === "complete") {
    requestItem.status = "completed";
    user.tasksCompleted += 1;
    user.karmaPoints += 20;

    addNotification(user, {
      title: "Request marked as completed",
      message: `"${requestItem.title}" has been closed successfully.`,
      tone: "success",
    });

    await persistCurrentState();

    sendJson(response, 200, {
      message: "Request marked as completed.",
      profile: buildProfilePayload(user),
      user: buildUserPayload(user),
    });
    return true;
  }

  if (action === "delete") {
    requests = requests.filter((item) => item.id !== requestId);
    delete requestResponsesById[requestId];
    conversations = conversations.filter((conversation) => conversation.requestId !== requestId);

    addNotification(user, {
      title: "Request deleted",
      message: `"${requestItem.title}" has been removed from your activity.`,
      tone: "info",
    });

    await persistCurrentState();

    sendJson(response, 200, {
      message: "Request deleted successfully.",
      profile: buildProfilePayload(user),
      user: buildUserPayload(user),
    });
    return true;
  }

  sendJson(response, 400, { message: "Unsupported request action." });
  return true;
}

async function handleRequestSuggestion(request, response) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  try {
    const {
      title = "",
      description = "",
      location = "",
      categorySlug = "",
      specificNeed = "",
      urgency = "",
    } = await readJsonBody(request);

    if (!title.trim() && !description.trim() && !specificNeed.trim()) {
      sendJson(response, 400, {
        message: "Write at least a title or a short draft before asking for AI help.",
      });
      return true;
    }

    const suggestedTitle = buildTitleSuggestion({
      title,
      specificNeed,
      categorySlug,
      urgency,
    });
    const suggestedDescription = buildDescriptionSuggestion({
      title: suggestedTitle,
      description,
      location,
      urgency,
      categorySlug,
      specificNeed,
    });

    sendJson(response, 200, {
      message: "AI polished your request. Review it before posting.",
      suggestion: {
        title: suggestedTitle,
        description: suggestedDescription,
      },
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error.message || "Unable to generate a suggestion right now.",
    });
  }

  return true;
}

async function handleWalletTopUp(request, response) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  try {
    const {
      amount = 0,
      paymentMethod = "",
      upiId = "",
      cardNumber = "",
      expiry = "",
      cvv = "",
      cardholderName = "",
      simulationOutcome = "success",
    } = await readJsonBody(request);
    const parsedAmount = Number(amount) || 0;
    const normalizedMethod = paymentMethod.trim().toLowerCase();
    const normalizedUpiId = upiId.trim();
    const normalizedCardNumber = cardNumber.replace(/\s+/g, "");
    const normalizedExpiry = expiry.trim();
    const normalizedCvv = cvv.trim();
    const normalizedCardholderName = cardholderName.trim();
    const normalizedSimulationOutcome = simulationOutcome.trim().toLowerCase();
    const allowedMethods = [
      "upi",
      "needhelp-wallet",
      "card",
      "netbanking",
    ];
    const allowedSimulationOutcomes = ["success", "pending", "failed"];

    if (parsedAmount < 100) {
      sendJson(response, 400, {
        message: "Add at least Rs 100 to continue.",
      });
      return true;
    }

    if (!allowedMethods.includes(normalizedMethod)) {
      sendJson(response, 400, {
        message: "Please select a valid payment method.",
      });
      return true;
    }

    if (!allowedSimulationOutcomes.includes(normalizedSimulationOutcome)) {
      sendJson(response, 400, {
        message: "Please select a valid payment outcome.",
      });
      return true;
    }

    if (normalizedMethod === "upi" && !normalizedUpiId.includes("@")) {
      sendJson(response, 400, {
        message: "Enter a valid UPI ID to continue.",
      });
      return true;
    }

    if (
      normalizedMethod === "card" &&
      (
        normalizedCardNumber.length < 12 ||
        !normalizedExpiry ||
        normalizedCvv.length < 3 ||
        !normalizedCardholderName
      )
    ) {
      sendJson(response, 400, {
        message: "Complete all card details before paying.",
      });
      return true;
    }

    const processingFee =
      Math.round(parsedAmount * platformFeeRate) + flatPlatformFee;
    const simulation = buildDemoPaymentSimulation(
      normalizedMethod,
      parsedAmount,
      processingFee,
      normalizedSimulationOutcome
    );

    if (normalizedSimulationOutcome === "failed") {
      sendJson(response, 402, {
        message: "Payment failed. Please try again.",
        simulation,
      });
      return true;
    }

    user.walletBalance += parsedAmount;

    getWalletTransactions(user.id).unshift({
      id: `wallet-${Date.now()}`,
      title: "Added money to wallet",
      amount: parsedAmount,
      type: "credit",
      status: normalizedSimulationOutcome === "pending" ? "Pending" : "Completed",
      postedAt: "Just now",
      fee: processingFee,
      note: `Via ${simulation.methodLabel}`,
      methodLabel: simulation.methodLabel,
    });

    addNotification(user, {
      title:
        normalizedSimulationOutcome === "pending"
          ? "Wallet top-up is pending"
          : "Wallet top-up completed",
      message:
        normalizedSimulationOutcome === "pending"
          ? `Rs ${parsedAmount} is being added to your wallet. Confirmation is in progress.`
          : `Rs ${parsedAmount} was added successfully to your wallet.`,
      tone: normalizedSimulationOutcome === "pending" ? "warning" : "success",
    });

    await persistCurrentState();

    sendJson(response, 200, {
      message:
        normalizedSimulationOutcome === "pending"
          ? `Rs ${parsedAmount} is being processed and will reflect in your wallet shortly.`
          : `Rs ${parsedAmount} added to your wallet successfully.`,
      wallet: buildWalletPayload(user),
      billing: {
        amount: parsedAmount,
        processingFee,
        totalCharge: parsedAmount + processingFee,
      },
      simulation,
      user: buildUserPayload(user),
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error.message || "Unable to add money right now.",
    });
  }

  return true;
}

async function handleNotificationsRead(request, response) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  const notifications = getNotifications(user.id);

  notifications.forEach((notification) => {
    notification.unread = false;
  });
  syncNotificationCount(user);

  await persistCurrentState();

  sendJson(response, 200, buildNotificationsPayload(user));
  return true;
}

async function handleSosToggle(request, response) {
  const user = requireAuth(request, response);

  if (!user) {
    return true;
  }

  try {
    const { active } = await readJsonBody(request);
    const nextActive =
      typeof active === "boolean" ? active : !Boolean(user.sosActive);
    user.sosActive = nextActive;

    if (nextActive) {
      addNotification(user, {
        title: "SOS has been activated",
        message:
          "Nearby verified helpers and the safety desk have been alerted with your last known location.",
        tone: "warning",
      });
    }

    await persistCurrentState();

    sendJson(response, 200, {
      message: nextActive
        ? "SOS is now active. Nearby verified helpers have been alerted."
        : "SOS has been turned off. You are back in normal mode.",
      sos: {
        active: nextActive,
        nearbyHelpers: 3,
        estimatedResponse: "Under 3 min",
      },
      user: buildUserPayload(user),
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error.message || "Unable to update SOS right now.",
    });
  }

  return true;
}

export async function handleApiRequest(request, response) {
  const method = request.method;
  const url = request.originalUrl || request.url || request.path || "";

  if (!url.startsWith("/api")) {
    return false;
  }

  if (method === "OPTIONS") {
    sendEmptyStatus(response, 204);
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

  if (method === "GET" && url === "/api/request-form") {
    const user = requireAuth(request, response);

    if (!user) {
      return true;
    }

    sendJson(response, 200, buildRequestFormPayload(user));
    return true;
  }

  if (method === "GET" && url === "/api/profile") {
    const user = requireAuth(request, response);

    if (!user) {
      return true;
    }

    sendJson(response, 200, buildProfilePayload(user));
    return true;
  }

  if (method === "GET" && /^\/api\/profiles\/[^/]+$/.test(url)) {
    const profileMatch = url.match(/^\/api\/profiles\/([^/]+)$/);
    return handlePublicProfileFetch(request, response, profileMatch[1]);
  }

  if (method === "GET" && url === "/api/messages") {
    return handleMessagesFetch(request, response);
  }

  if (method === "GET" && url === "/api/wallet") {
    const user = requireAuth(request, response);

    if (!user) {
      return true;
    }

    sendJson(response, 200, buildWalletPayload(user));
    return true;
  }

  if (method === "GET" && url === "/api/notifications") {
    const user = requireAuth(request, response);

    if (!user) {
      return true;
    }

    syncNotificationCount(user);
    sendJson(response, 200, buildNotificationsPayload(user));
    return true;
  }

  if (method === "POST" && url === "/api/request-suggestions") {
    return handleRequestSuggestion(request, response);
  }

  if (method === "POST" && url === "/api/auth/reset-password") {
    return handlePasswordReset(request, response);
  }

  if (method === "POST" && url === "/api/notifications/mark-read") {
    return handleNotificationsRead(request, response);
  }

  if (method === "POST" && url === "/api/sos/toggle") {
    return handleSosToggle(request, response);
  }

  if (method === "POST" && url === "/api/wallet/add-money") {
    return handleWalletTopUp(request, response);
  }

  if (method === "PUT" && url === "/api/profile") {
    return handleProfileUpdate(request, response);
  }

  if (method === "GET" && url.startsWith("/api/requests")) {
    const requestDetailMatch = url.match(/^\/api\/requests\/([^/?]+)$/);
    const requestActionMatch = url.match(/^\/api\/requests\/([^/]+)\/(help|chat)$/);

    if (requestDetailMatch && !requestActionMatch) {
      const user = requireAuth(request, response);

      if (!user) {
        return true;
      }

      const requestItem = findRequestById(requestDetailMatch[1]);

      if (!requestItem) {
        sendJson(response, 404, {
          message: "Request not found.",
        });
        return true;
      }

      sendJson(response, 200, buildRequestDetailPayload(requestItem, user));
      return true;
    }

    if (!requestActionMatch) {
      return handleProtectedBrowseRequest(request, response);
    }
  }

  if (method === "POST" && url === "/api/auth/login") {
    try {
      const { email = "", password = "" } = await readJsonBody(request);
      const user = findUserByEmail(email);
      const normalizedEmail = normalizeEmail(email);

      if (!normalizedEmail || !password.trim()) {
        sendJson(response, 400, {
          message: "Email and password are required.",
        });
        return true;
      }

      if (!isValidEmail(normalizedEmail)) {
        sendJson(response, 400, {
          message: "Please enter a valid email address.",
        });
        return true;
      }

      const isValidCredential = user
        ? await verifyPassword(password, user.password)
        : false;

      if (!user || !isValidCredential) {
        sendJson(response, 401, {
          message: "Invalid email or password.",
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

      if (!isValidEmail(normalizedEmail)) {
        sendJson(response, 400, {
          message: "Please enter a valid email address.",
        });
        return true;
      }

      if (!isValidPhone(phone)) {
        sendJson(response, 400, {
          message: "Please enter a valid phone number.",
        });
        return true;
      }

      if (password !== confirmPassword) {
        sendJson(response, 400, {
          message: "Password and confirm password must match.",
        });
        return true;
      }

      if (!isStrongPassword(password)) {
        sendJson(response, 400, {
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
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
        password: await hashPassword(password),
        name: fullName.trim(),
        phone: phone.trim(),
        address: "Your area",
        walletBalance: 250,
        karmaPoints: 25,
        notificationCount: 1,
        sosActive: false,
        overallRating: 5.0,
        tasksCompleted: 0,
        helpRequested: 0,
      };

      users.push(newUser);
      await persistCurrentState();

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

      const socialUser = await findOrCreateSocialUser(normalizedProvider);
      await persistCurrentState();
      sendJson(
        response,
        200,
        buildAuthResponse(
          socialUser,
          `${formatProviderName(normalizedProvider)} ${action} successful.`
        )
      );
    } catch (error) {
      sendJson(response, 400, {
        message: error.message || "Unable to process social authentication.",
      });
    }

    return true;
  }

  if (method === "POST") {
    const conversationMessageMatch = url.match(/^\/api\/messages\/([^/]+)$/);
    const conversationSettingsMatch = url.match(/^\/api\/messages\/([^/]+)\/settings$/);
    const requestActionMatch = url.match(/^\/api\/requests\/([^/]+)\/(help|chat)$/);
    const requestResponseMatch = url.match(/^\/api\/requests\/([^/]+)\/responses$/);
    const requestManageMatch = url.match(/^\/api\/requests\/([^/]+)\/(complete|delete)$/);

    if (conversationMessageMatch) {
      return handleMessageSend(request, response, conversationMessageMatch[1]);
    }

    if (conversationSettingsMatch) {
      return handleConversationPreferenceUpdate(
        request,
        response,
        conversationSettingsMatch[1]
      );
    }

    if (requestActionMatch) {
      const [, requestId, action] = requestActionMatch;
      return handleRequestAction(request, response, action, requestId);
    }

    if (requestResponseMatch) {
      return handleRequestResponseSubmit(request, response, requestResponseMatch[1]);
    }

    if (requestManageMatch) {
      return handleRequestManage(
        request,
        response,
        requestManageMatch[1],
        requestManageMatch[2]
      );
    }

    if (url === "/api/requests") {
      return handleCreateRequest(request, response);
    }
  }

  sendJson(response, 404, {
    message: "Route not found.",
  });
  return true;
}
