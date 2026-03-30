const users = [
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
    overallRating: 4.7,
    tasksCompleted: 22,
    helpRequested: 10,
  },
];

const sessions = new Map();
const allowedProviders = ["google", "facebook"];
const sessionTokenPrefix = "needhelp-session";
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

const helpingHistoryByUser = {
  "user-demo-1": [
    {
      id: "help-1",
      title: "Helped with WiFi troubleshooting",
      description: "Fixed internet connectivity issue in 15 minutes",
      karmaEarned: 25,
      completedAt: "2 days ago",
      status: "Completed",
      tone: "emerald",
    },
    {
      id: "help-2",
      title: "Blood Donation - Emergency",
      description: "Donated O+ blood at AIIMS for emergency patient",
      karmaEarned: 50,
      completedAt: "1 week ago",
      status: "Completed",
      tone: "rose",
    },
  ],
};

const reviewsByUser = {
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

const requests = [
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

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

function findUserById(userId = "") {
  return users.find((user) => user.id === userId);
}

function createSessionToken(user) {
  const token = `${sessionTokenPrefix}-${user.id}`;
  sessions.set(token, user.id);
  return token;
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
    notificationCount: user.notificationCount,
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

function readAuthorizedUser(request) {
  const authorization = request.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return null;
  }

  const userId =
    sessions.get(token) ||
    (token.startsWith(`${sessionTokenPrefix}-`)
      ? token.slice(`${sessionTokenPrefix}-`.length)
      : "");

  if (!userId) {
    return null;
  }

  sessions.set(token, userId);

  return findUserById(userId) || null;
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

function buildProfilePayload(user) {
  const myRequests = sortRequests(
    requests.filter((requestItem) => requestItem.createdByUserId === user.id)
  ).map((requestItem) => ({
    id: requestItem.id,
    title: requestItem.title,
    description: requestItem.description,
    category: getCategoryLabel(requestItem.categorySlug),
    urgency: requestItem.urgency,
    responseCount: requestItem.responseCount,
    postedAt: formatPostedTime(requestItem.postedMinutesAgo),
    status: "Open",
    tone: requestItem.tone,
  }));

  const helpingHistory = helpingHistoryByUser[user.id] || [];
  const reviews = reviewsByUser[user.id] || [];
  const nextLevelPoints = 500;
  const pointsToNextLevel = Math.max(nextLevelPoints - user.karmaPoints, 0);

  return {
    user: buildUserPayload(user),
    badges: ["Verified Helper", "Trusted Member"],
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

  const requestUrl = new URL(request.url, "http://localhost");
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
    user.notificationCount += 1;
  }

  sendJson(response, 200, {
    message: getActionMessage(action, requestItem),
    request: buildRequestPayload(requestItem, user),
    user: buildUserPayload(user),
  });
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
    }

    user.notificationCount += 1;
    user.helpRequested += 1;

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

export async function handleApiRequest(request, response) {
  const { method, url = "" } = request;

  if (!url.startsWith("/api")) {
    return false;
  }

  if (method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

  if (method === "POST" && url === "/api/request-suggestions") {
    return handleRequestSuggestion(request, response);
  }

  if (method === "GET" && url.startsWith("/api/requests")) {
    const requestActionMatch = url.match(/^\/api\/requests\/([^/]+)\/(help|chat)$/);

    if (!requestActionMatch) {
      return handleProtectedBrowseRequest(request, response);
    }
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
        address: "Your area",
        walletBalance: 250,
        karmaPoints: 25,
        notificationCount: 1,
        overallRating: 5.0,
        tasksCompleted: 0,
        helpRequested: 0,
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

  if (method === "POST") {
    const requestActionMatch = url.match(/^\/api\/requests\/([^/]+)\/(help|chat)$/);

    if (requestActionMatch) {
      const [, requestId, action] = requestActionMatch;
      return handleRequestAction(request, response, action, requestId);
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
