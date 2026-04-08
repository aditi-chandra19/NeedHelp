import { useEffect, useMemo, useState } from "react";
import {
  CircleAlert,
  CircleCheckBig,
  Info,
  LoaderCircle,
  MapPin,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppPageFrame from "../../common/components/AppPageFrame.jsx";
import {
  clearStoredSession,
  getStoredSession,
} from "../../auth/services/session.js";
import PostCategoryOption from "../components/PostCategoryOption.jsx";
import PostStepIndicator from "../components/PostStepIndicator.jsx";
import PostUrgencyOption from "../components/PostUrgencyOption.jsx";
import {
  createRequest,
  fetchRequestForm,
  generateRequestSuggestion,
} from "../services/requestService.js";

const initialFormState = {
  title: "",
  description: "",
  manualAddress: "",
  location: "",
  categorySlug: "",
  specificNeed: "",
  urgency: "",
  rewardText: "",
  paymentEnabled: false,
  paymentAmount: "",
  coordinates: null,
};

const tips = [
  "Be specific about what you need so the right helpers respond.",
  "Mention an exact location for faster local matches.",
  "Pick urgency honestly to keep the platform trustworthy.",
  "Keep the first message clear and respectful once someone responds.",
];

function calculateBilling(paymentAmount, billingMeta) {
  const taskAmount = Number(paymentAmount) || 0;
  const platformFee = taskAmount
    ? Math.round(taskAmount * billingMeta.platformFeeRate) + billingMeta.flatPlatformFee
    : 0;

  return {
    taskAmount,
    platformFee,
    totalCharge: taskAmount + platformFee,
  };
}

export default function PostRequestPage() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const user = session?.user;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [categories, setCategories] = useState([]);
  const [urgencies, setUrgencies] = useState([]);
  const [billingMeta, setBillingMeta] = useState({
    platformFeeRate: 0.02,
    flatPlatformFee: 5,
  });

  useEffect(() => {
    let isActive = true;

    async function loadFormMeta() {
      try {
        const payload = await fetchRequestForm();

        if (!isActive) {
          return;
        }

        setCategories(payload.categories);
        setUrgencies(payload.urgencies);
        setBillingMeta(payload.billing);
        setFormData((current) => ({
          ...current,
          location: payload.defaults.location,
          rewardText: payload.defaults.rewardText,
        }));
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus({
          type: "error",
          message: error.message || "Unable to load the posting form right now.",
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadFormMeta();

    return () => {
      isActive = false;
    };
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.slug === formData.categorySlug) || null,
    [categories, formData.categorySlug]
  );

  const specificNeedOptions = selectedCategory?.specificNeeds || [];
  const billingSummary = calculateBilling(formData.paymentAmount, billingMeta);

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  function updateField(name, value) {
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "location" ? { coordinates: null } : {}),
    }));
  }

  function validateCurrentStep(step = currentStep) {
    if (step === 1) {
      if (!formData.title.trim()) {
        return "Tell the community what you need help with.";
      }

      if (!formData.description.trim()) {
        return "Add a short description so helpers understand the request.";
      }

      if (formData.description.trim().length < 30) {
        return "Description should be at least 30 characters for better responses.";
      }

      if (!formData.location.trim()) {
        return "Add your location so nearby helpers can find you.";
      }

      return "";
    }

    if (step === 2) {
      if (!formData.categorySlug) {
        return "Choose a category for your request.";
      }

      if (!formData.urgency) {
        return "Select how urgent this request is.";
      }

      return "";
    }

    if (step === 3 && formData.paymentEnabled) {
      if (!String(formData.paymentAmount).trim()) {
        return "Add a payment amount or switch payment off.";
      }

      if (Number(formData.paymentAmount) < 50) {
        return "Payment amount should be at least Rs 50.";
      }

      if ((user?.walletBalance || 0) < billingSummary.totalCharge) {
        return `You need Rs ${billingSummary.totalCharge} in your wallet for this paid request.`;
      }
    }

    return "";
  }

  function handleNextStep() {
    const validationMessage = validateCurrentStep();

    if (validationMessage) {
      setStatus({ type: "error", message: validationMessage });
      return;
    }

    setStatus({ type: "", message: "" });
    setCurrentStep((current) => Math.min(current + 1, 3));
  }

  function handlePreviousStep() {
    setStatus({ type: "", message: "" });
    setCurrentStep((current) => Math.max(current - 1, 1));
  }

  function handleCategorySelect(categorySlug) {
    setFormData((current) => ({
      ...current,
      categorySlug,
      specificNeed: "",
    }));
  }

  async function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setStatus({
        type: "error",
        message: "Location access is not supported in this browser.",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const formattedCoordinates = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setFormData((current) => ({
          ...current,
          location: `Current location (${formattedCoordinates})`,
          coordinates: {
            lat: latitude,
            lng: longitude,
          },
        }));
        setStatus({
          type: "success",
          message:
            "Current location detected. You can keep the coordinates or replace them with a nearby landmark for better responses.",
        });
        setIsLocating(false);
      },
      () => {
        setStatus({
          type: "error",
          message: "Location permission was denied. You can still type it manually.",
        });
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }

  async function handleGenerateSuggestion() {
    setIsGeneratingSuggestion(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = await generateRequestSuggestion({
        title: formData.title,
        description: formData.description,
        location: formData.manualAddress || formData.location,
        categorySlug: formData.categorySlug,
        specificNeed: formData.specificNeed,
        urgency: formData.urgency,
      });

      setFormData((current) => ({
        ...current,
        title: payload.suggestion.title,
        description: payload.suggestion.description,
      }));
      setStatus({
        type: "success",
        message: payload.message,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to generate AI suggestions right now.",
      });
    } finally {
      setIsGeneratingSuggestion(false);
    }
  }

  async function handleSubmit() {
    const validationMessage = validateCurrentStep(3);

    if (validationMessage) {
      setStatus({ type: "error", message: validationMessage });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = await createRequest({
        ...formData,
        paymentAmount: formData.paymentAmount ? Number(formData.paymentAmount) : 0,
      });

      navigate(`/browse?category=${formData.categorySlug}`, {
        state: {
          flashType: "success",
          flashMessage: payload.message,
        },
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to post this request right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AppPageFrame onLogout={handleLogout} user={user}>
        <main className="px-4 py-16 md:px-6">
          <div className="nh-panel mx-auto flex max-w-4xl items-center justify-center p-12">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading request form...
            </div>
          </div>
        </main>
      </AppPageFrame>
    );
  }

  return (
    <AppPageFrame onLogout={handleLogout} user={user}>
      <main className="px-4 pb-16 pt-10 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5f7ea8]">
              Request support nearby
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Post a Help Request
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-500">
              Get help from trusted neighbors nearby with a clear, structured request.
            </p>
          </div>

          <div className="mt-8">
            <PostStepIndicator currentStep={currentStep} />
          </div>

          {status.message ? (
            <div
              className={`mx-auto mt-6 flex max-w-4xl items-start gap-3 ${
                status.type === "error"
                  ? "nh-status-error"
                  : "nh-status-success"
              }`}
            >
              {status.type === "error" ? (
                <CircleAlert size={18} className="mt-0.5 shrink-0" />
              ) : (
                <CircleCheckBig size={18} className="mt-0.5 shrink-0" />
              )}
              <p>{status.message}</p>
            </div>
          ) : null}

          <div className="nh-panel mx-auto mt-8 max-w-5xl p-6 sm:p-8">
            {currentStep === 1 ? (
              <section className="space-y-6">
                <div className="rounded-[1.5rem] border border-[#e1e9f2] bg-[#fbfdff] px-5 py-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7ea8]">
                    Step 1
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Describe the request clearly
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Clear titles, honest urgency, and a precise location help the right people respond faster.
                  </p>
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-800"
                    htmlFor="title"
                  >
                    What do you need help with? *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="e.g., Fix leaking tap, Need blood donor O+, Study buddy for exam"
                    className="nh-input"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-800"
                    htmlFor="description"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>Describe your request in detail *</span>
                      <button
                        type="button"
                        onClick={handleGenerateSuggestion}
                        disabled={isGeneratingSuggestion}
                        className="nh-button-quiet"
                      >
                        {isGeneratingSuggestion ? (
                          <>
                            <LoaderCircle size={14} className="animate-spin" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            AI Suggest
                          </>
                        )}
                      </button>
                    </span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Provide more details about what you need. Be specific to get better responses."
                    maxLength={500}
                    rows={6}
                    className="w-full rounded-[1.1rem] border border-[#dbe4ee] bg-white px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-[#5f80af] focus:bg-[#fbfdff] focus:ring-4 focus:ring-[rgba(95,128,175,0.12)]"
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-800"
                    htmlFor="manualAddress"
                  >
                    Manual address or landmark (Optional)
                  </label>
                  <input
                    id="manualAddress"
                    type="text"
                    value={formData.manualAddress}
                    onChange={(event) => updateField("manualAddress", event.target.value)}
                    placeholder="e.g., Block A, near Rajiv Chowk metro gate 3"
                    className="nh-input"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-800"
                    htmlFor="location"
                  >
                    Your Location *
                  </label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(event) => updateField("location", event.target.value)}
                      className="nh-input pl-12"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#35557e] transition hover:text-[#233b5d] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLocating ? (
                      <>
                        <LoaderCircle size={14} className="animate-spin" />
                        Detecting current location...
                      </>
                    ) : (
                      "Use my current location"
                    )}
                  </button>
                  {formData.coordinates ? (
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      GPS detected. For the best helper responses, replace this with a nearby
                      building, street, or landmark if needed.
                    </p>
                  ) : null}
                </div>
              </section>
            ) : null}

            {currentStep === 2 ? (
              <section>
                <div className="rounded-[1.5rem] border border-[#e1e9f2] bg-[#fbfdff] px-5 py-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7ea8]">
                    Step 2
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Help the system route it well
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Category and urgency decide who sees the request first and how quickly it gets surfaced.
                  </p>
                </div>

                <div>
                  <p className="mt-8 text-sm font-semibold text-slate-800">
                    Select Category *
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                      <PostCategoryOption
                        key={category.slug}
                        category={category}
                        selected={formData.categorySlug === category.slug}
                        onSelect={handleCategorySelect}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-800"
                    htmlFor="specificNeed"
                  >
                    Specific Need
                  </label>
                  <select
                    id="specificNeed"
                    value={formData.specificNeed}
                    onChange={(event) => updateField("specificNeed", event.target.value)}
                    disabled={!selectedCategory}
                    className="nh-input disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">Choose specific need...</option>
                    {specificNeedOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-8">
                  <p className="mb-4 text-sm font-semibold text-slate-800">
                    How urgent is this? *
                  </p>
                  <div className="space-y-4">
                    {urgencies.map((option) => (
                      <PostUrgencyOption
                        key={option.value}
                        option={option}
                        selected={formData.urgency === option.value}
                        onSelect={(value) => updateField("urgency", value)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {currentStep === 3 ? (
              <section className="space-y-6">
                <div className="rounded-[1.5rem] border border-[#e1e9f2] bg-[#fbfdff] px-5 py-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7ea8]">
                    Step 3
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Review trust, payment, and summary
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add optional incentives, double-check the details, and post once the request feels accurate.
                  </p>
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-800"
                    htmlFor="rewardText"
                  >
                    Offer a reward? (Optional)
                  </label>
                  <input
                    id="rewardText"
                    type="text"
                    value={formData.rewardText}
                    onChange={(event) => updateField("rewardText", event.target.value)}
                    placeholder="e.g., Rs50 tip, Free coffee, etc."
                    className="nh-input"
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Offering rewards can get faster responses.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-emerald-900">
                          Add Payment for Guaranteed Help
                        </h2>
                        <p className="mt-1 text-sm text-emerald-700">
                          Get faster and priority responses by offering payment.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateField("paymentEnabled", !formData.paymentEnabled)
                      }
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                        formData.paymentEnabled ? "bg-slate-900" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                          formData.paymentEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {formData.paymentEnabled ? (
                    <div className="mt-5 space-y-4">
                      <div>
                        <label
                          className="mb-2 block text-sm font-semibold text-slate-800"
                          htmlFor="paymentAmount"
                        >
                          Payment Amount (Rs)
                        </label>
                        <input
                          id="paymentAmount"
                          type="number"
                          min="50"
                          step="10"
                          value={formData.paymentAmount}
                          onChange={(event) =>
                            updateField("paymentAmount", event.target.value)
                          }
                          placeholder="Enter amount if you want paid priority help"
                          className="nh-input bg-white"
                        />
                      </div>

                      <div className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm text-slate-600">
                        <div className="flex items-center justify-between gap-3 py-1">
                          <span>Task Amount</span>
                          <span className="font-semibold text-slate-900">
                            {formData.paymentAmount ? `Rs ${billingSummary.taskAmount}` : "--"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 py-1">
                          <span>
                            Platform Fee ({Math.round(billingMeta.platformFeeRate * 100)}% + Rs {billingMeta.flatPlatformFee})
                          </span>
                          <span className="font-semibold text-slate-900">
                            {formData.paymentAmount ? `Rs ${billingSummary.platformFee}` : "--"}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-base font-bold text-emerald-700">
                          <span>Total Amount</span>
                          <span>{formData.paymentAmount ? `Rs ${billingSummary.totalCharge}` : "--"}</span>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">
                        Payment will be held securely and released when the task is completed.
                        You currently have Rs {user?.walletBalance ?? 0} in your wallet.
                      </div>
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-emerald-800">
                      Switch this on if you want stronger incentive and faster replies for the request.
                    </p>
                  )}
                </div>

                <div className="rounded-[1.75rem] border border-[#dfe8f1] bg-[#f8fbfe] p-5">
                  <h2 className="text-2xl font-bold text-slate-900">Request Summary</h2>
                  <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <div>
                      <p className="text-slate-400">Title</p>
                      <p className="mt-1 font-semibold text-slate-900">{formData.title}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Category</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {selectedCategory?.label || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Urgency</p>
                      <p className="mt-1 font-semibold text-slate-900">{formData.urgency}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Location</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formData.manualAddress || formData.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-[#dfe8f1] bg-[#f5f9fd] p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-[#35557e]">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#233b5d]">Safety Reminder</p>
                      <p className="mt-2 text-sm leading-6 text-[#496484]">
                        Only share personal details once you&apos;ve verified the helper&apos;s
                        profile and ratings. Use in-app chat first.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={currentStep === 1 || isSubmitting}
                className="nh-button-secondary h-12 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="nh-button-primary h-12 px-8"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="nh-button-primary h-12 px-8 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle size={18} className="mr-2 animate-spin" />
                      Posting Request...
                    </>
                  ) : (
                    "Post Request"
                  )}
                </button>
              )}
            </div>
          </div>

          {currentStep === 1 ? (
            <div className="mx-auto mt-6 max-w-5xl rounded-[1.75rem] border border-[#dfe8f1] bg-[#f5f9fd] p-6">
              <div className="flex items-center gap-2 text-[#233b5d]">
                <Info size={16} />
                <p className="font-semibold">Tips for better responses</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
                {tips.map((tip) => (
                  <li key={tip}>- {tip}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </main>
    </AppPageFrame>
  );
}
