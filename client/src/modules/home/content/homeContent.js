import {
  ArrowRight,
  BriefcaseMedical,
  CarFront,
  CheckCircle2,
  Coins,
  GraduationCap,
  HandHelping,
  HeartHandshake,
  Home,
  House,
  LaptopMinimal,
  MapPin,
  Package,
  PawPrint,
  PartyPopper,
  ShieldAlert,
  ShieldCheck,
  Star,
  UsersRound,
  Wrench,
  Zap,
} from "lucide-react";

export const heroStats = [
  {
    label: "Active Users",
    value: "10,000+",
    icon: UsersRound,
    accent: "bg-sky-600",
  },
  {
    label: "Tasks Completed",
    value: "50,000+",
    icon: HeartHandshake,
    accent: "bg-rose-500",
  },
  {
    label: "Avg Response",
    value: "< 5 min",
    icon: Zap,
    accent: "bg-amber-500",
  },
  {
    label: "Verified Helpers",
    value: "8,000+",
    icon: ShieldCheck,
    accent: "bg-emerald-600",
  },
];

export const urgentRequests = [
  {
    id: "req-1",
    title: "Need help fixing leaking tap urgently",
    description:
      "Kitchen tap is leaking badly. Water wastage happening. Need someone who knows basic plumbing.",
    category: "Home & Daily Help",
    severity: "High",
    accent: "from-sky-600 to-indigo-600",
    requester: "Rahul Sharma",
    rating: "4.8",
    distance: "0.5 km",
    posted: "48m ago",
    chats: "3",
    payment: "Rs 200",
    tip: "Rs 50 tip",
    avatar: "RS",
  },
  {
    id: "req-2",
    title: "Urgent: Blood donor needed O+ at AIIMS",
    description:
      "Emergency blood requirement for my uncle. O+ blood group. AIIMS Delhi. Please help!",
    category: "Medical & Emergency",
    severity: "Emergency",
    accent: "from-rose-500 to-red-500",
    requester: "Priya Patel",
    rating: "4.6",
    distance: "1.2 km",
    posted: "38m ago",
    chats: "7",
    payment: "Rs 0",
    tip: "Priority match",
    avatar: "PP",
  },
  {
    id: "req-3",
    title: "Flat tyre near Saket, need push to mechanic",
    description:
      "Bike flat tyre. Mechanic shop is 500m away. Need help pushing the bike safely.",
    category: "Vehicle & Transport",
    severity: "High",
    accent: "from-orange-500 to-amber-500",
    requester: "Sneha Reddy",
    rating: "4.9",
    distance: "0.8 km",
    posted: "43m ago",
    chats: "1",
    payment: "Rs 150",
    tip: "Rs 100 tip",
    avatar: "SR",
  },
];

export const categories = [
  { label: "Home & Daily Help", icon: House },
  { label: "Vehicle & Transport", icon: CarFront },
  { label: "Medical & Emergency", icon: BriefcaseMedical },
  { label: "Delivery & Pickup", icon: Package },
  { label: "Student Help", icon: GraduationCap },
  { label: "Pet & Animal Help", icon: PawPrint },
  { label: "Personal Help", icon: HandHelping },
  { label: "Event & Social", icon: PartyPopper },
  { label: "Skill-Based Help", icon: Wrench },
  { label: "Tech Help", icon: LaptopMinimal },
];

export const steps = [
  {
    title: "1. Post Your Request",
    description: "Share what help you need with location and details",
    icon: MapPin,
  },
  {
    title: "2. Get Matched",
    description: "Nearby verified helpers respond within minutes",
    icon: HeartHandshake,
  },
  {
    title: "3. Earn Karma",
    description: "Build trust and reputation by helping others",
    icon: Star,
  },
];

export const trustFeatures = [
  {
    title: "Phone Verification",
    description: "All users verified via OTP",
    icon: CheckCircle2,
    accent: "bg-emerald-600",
  },
  {
    title: "Karma Points System",
    description: "Earn trust by helping others",
    icon: Coins,
    accent: "bg-amber-500",
  },
  {
    title: "SOS Emergency Button",
    description: "Safety features built-in",
    icon: ShieldAlert,
    accent: "bg-rose-500",
  },
  {
    title: "In-App Chat & Ratings",
    description: "Rate and review every interaction",
    icon: Home,
    accent: "bg-indigo-600",
  },
];

export const trustStats = [
  {
    value: "4.8/5",
    label: "Avg Rating",
    icon: Star,
    cardClass: "bg-gradient-to-br from-sky-700 to-indigo-800 text-white",
  },
  {
    value: "98%",
    label: "Success Rate",
    icon: ArrowRight,
    cardClass: "bg-gradient-to-br from-indigo-700 to-violet-800 text-white",
  },
  {
    value: "100%",
    label: "Verified",
    icon: ShieldCheck,
    cardClass: "bg-gradient-to-br from-emerald-600 to-teal-700 text-white",
  },
  {
    value: "< 5m",
    label: "Response Time",
    icon: Zap,
    cardClass: "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
  },
];
