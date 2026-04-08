import mongoose from "mongoose";

const flexibleOptions = {
  timestamps: true,
  versionKey: false,
  strict: false,
};

const appStateSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    _id: String,
    id: { type: String, required: true, unique: true },
    email: { type: String, index: true },
  },
  flexibleOptions
);

const requestSchema = new mongoose.Schema(
  {
    _id: String,
    id: { type: String, required: true, unique: true },
    createdByUserId: { type: String, index: true },
  },
  flexibleOptions
);

const conversationSchema = new mongoose.Schema(
  {
    _id: String,
    id: { type: String, required: true, unique: true },
    requestId: { type: String, index: true },
    helperId: { type: String, index: true },
    requesterId: { type: String, index: true },
  },
  flexibleOptions
);

const requestResponseSchema = new mongoose.Schema(
  {
    _id: String,
    id: { type: String, required: true, unique: true },
    requestId: { type: String, index: true, required: true },
    responderId: { type: String, index: true },
  },
  flexibleOptions
);

const notificationSchema = new mongoose.Schema(
  {
    _id: String,
    id: { type: String, required: true, unique: true },
    userId: { type: String, index: true, required: true },
  },
  flexibleOptions
);

const walletTransactionSchema = new mongoose.Schema(
  {
    _id: String,
    id: { type: String, required: true, unique: true },
    userId: { type: String, index: true, required: true },
  },
  flexibleOptions
);

const reviewSchema = new mongoose.Schema(
  {
    _id: String,
    id: { type: String, required: true, unique: true },
    userId: { type: String, index: true, required: true },
  },
  flexibleOptions
);

const helpingHistorySchema = new mongoose.Schema(
  {
    _id: String,
    id: { type: String, required: true, unique: true },
    userId: { type: String, index: true, required: true },
  },
  flexibleOptions
);

const AppState = mongoose.models.AppState || mongoose.model("AppState", appStateSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema, "users");
const Request = mongoose.models.Request || mongoose.model("Request", requestSchema, "requests");
const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema, "conversations");
const RequestResponse =
  mongoose.models.RequestResponse ||
  mongoose.model("RequestResponse", requestResponseSchema, "request_responses");
const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema, "notifications");
const WalletTransaction =
  mongoose.models.WalletTransaction ||
  mongoose.model("WalletTransaction", walletTransactionSchema, "wallet_transactions");
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema, "reviews");
const HelpingHistory =
  mongoose.models.HelpingHistory ||
  mongoose.model("HelpingHistory", helpingHistorySchema, "helping_history");

function cleanDoc(document) {
  if (!document) {
    return document;
  }

  const plain = { ...document };
  delete plain._id;
  delete plain.createdAt;
  delete plain.updatedAt;
  return plain;
}

function mapByKey(items, key) {
  return items.reduce((accumulator, item) => {
    const groupKey = item[key];

    if (!groupKey) {
      return accumulator;
    }

    if (!accumulator[groupKey]) {
      accumulator[groupKey] = [];
    }

    const nextItem = { ...item };
    delete nextItem[key];
    accumulator[groupKey].push(nextItem);
    return accumulator;
  }, {});
}

function flattenByKey(record = {}, key) {
  return Object.entries(record).flatMap(([groupKey, items]) =>
    (items || []).map((item) => ({
      _id: item.id,
      ...item,
      [key]: groupKey,
    }))
  );
}

function buildStructuredState({
  users = [],
  helpingHistoryByUser = {},
  reviewsByUser = {},
  walletTransactionsByUser = {},
  notificationsByUser = {},
  requests = [],
  requestResponsesById = {},
  conversations = [],
}) {
  return {
    users: users.map((item) => ({ _id: item.id, ...item })),
    requests: requests.map((item) => ({ _id: item.id, ...item })),
    conversations: conversations.map((item) => ({ _id: item.id, ...item })),
    requestResponses: flattenByKey(requestResponsesById, "requestId"),
    notifications: flattenByKey(notificationsByUser, "userId"),
    walletTransactions: flattenByKey(walletTransactionsByUser, "userId"),
    reviews: flattenByKey(reviewsByUser, "userId"),
    helpingHistory: flattenByKey(helpingHistoryByUser, "userId"),
  };
}

async function hasStructuredData() {
  const counts = await Promise.all([
    User.estimatedDocumentCount(),
    Request.estimatedDocumentCount(),
    Conversation.estimatedDocumentCount(),
    RequestResponse.estimatedDocumentCount(),
    Notification.estimatedDocumentCount(),
    WalletTransaction.estimatedDocumentCount(),
    Review.estimatedDocumentCount(),
    HelpingHistory.estimatedDocumentCount(),
  ]);

  return counts.some((count) => count > 0);
}

async function replaceCollection(Model, documents) {
  await Model.deleteMany({});

  if (documents.length) {
    await Model.insertMany(documents, { ordered: false });
  }
}

export async function connectToDatabase() {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/needhelp";

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  return mongoose.connection;
}

export async function loadPersistedState() {
  if (await hasStructuredData()) {
    const [
      users,
      requests,
      conversations,
      requestResponses,
      notifications,
      walletTransactions,
      reviews,
      helpingHistory,
    ] = await Promise.all([
      User.find().lean(),
      Request.find().lean(),
      Conversation.find().lean(),
      RequestResponse.find().lean(),
      Notification.find().lean(),
      WalletTransaction.find().lean(),
      Review.find().lean(),
      HelpingHistory.find().lean(),
    ]);

    return {
      users: users.map(cleanDoc),
      requests: requests.map(cleanDoc),
      conversations: conversations.map(cleanDoc),
      requestResponsesById: mapByKey(requestResponses.map(cleanDoc), "requestId"),
      notificationsByUser: mapByKey(notifications.map(cleanDoc), "userId"),
      walletTransactionsByUser: mapByKey(
        walletTransactions.map(cleanDoc),
        "userId"
      ),
      reviewsByUser: mapByKey(reviews.map(cleanDoc), "userId"),
      helpingHistoryByUser: mapByKey(helpingHistory.map(cleanDoc), "userId"),
    };
  }

  const document = await AppState.findOne({ key: "needhelp-state" }).lean();

  if (!document?.payload) {
    return null;
  }

  await persistState(document.payload);
  return document.payload;
}

export async function persistState(payload) {
  const structured = buildStructuredState(payload);

  await Promise.all([
    replaceCollection(User, structured.users),
    replaceCollection(Request, structured.requests),
    replaceCollection(Conversation, structured.conversations),
    replaceCollection(RequestResponse, structured.requestResponses),
    replaceCollection(Notification, structured.notifications),
    replaceCollection(WalletTransaction, structured.walletTransactions),
    replaceCollection(Review, structured.reviews),
    replaceCollection(HelpingHistory, structured.helpingHistory),
  ]);
}
