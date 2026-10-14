// Human labels for enum values used across the five systems.
export const label = (map: Record<string, string>, key: string | null | undefined) => (key ? (map[key] ?? key) : "");

export const FINDER_TYPES = {
  hostel: { label: "Hostels", one: "Hostel", icon: "BedDouble" },
  hotel: { label: "Hotels", one: "Hotel", icon: "Hotel" },
  restaurant: { label: "Restaurants", one: "Restaurant", icon: "UtensilsCrossed" },
  business: { label: "Businesses", one: "Business", icon: "Store" },
  place: { label: "Places", one: "Place", icon: "MapPin" },
  person: { label: "People", one: "Person", icon: "UserRound" },
} as const;
export type FinderType = keyof typeof FINDER_TYPES;
export const FINDER_TYPE_KEYS = ["hostel", "hotel", "restaurant", "business", "place", "person"] as const;

export const FINDER_AMENITIES: Record<FinderType, Array<string>> = {
  hostel: ["Wi-Fi", "Water 24/7", "Standby generator", "Security", "CCTV", "Study room", "Kitchen", "Laundry", "Air conditioning", "Self-contained", "Parking", "Shuttle"],
  hotel: ["Wi-Fi", "Pool", "Restaurant", "Bar", "Gym", "Air conditioning", "Parking", "Airport shuttle", "Conference room", "Room service", "Breakfast included"],
  restaurant: ["Dine-in", "Takeaway", "Delivery", "Vegetarian options", "Outdoor seating", "Wi-Fi", "Parking", "Card/MoMo payment"],
  business: ["Delivery", "Card/MoMo payment", "Parking", "Wheelchair access", "Open weekends"],
  place: ["Parking", "Restrooms", "Wheelchair access", "Guided tours", "Free entry"],
  person: [],
};

export const PRICE_UNITS: Record<FinderType, string> = {
  hostel: "per year",
  hotel: "per night",
  restaurant: "per meal",
  business: "",
  place: "entry",
  person: "per session",
};

export const EVENT_CATEGORIES: Record<string, string> = {
  campus: "Campus",
  src: "SRC",
  association: "Association",
  private: "Private",
  concert: "Concert",
  conference: "Conference",
  sports: "Sports",
  other: "Other",
};

export const JOB_TYPES: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  national_service: "National Service",
  gig: "Gig",
  volunteer: "Volunteer",
};
export const WORKPLACES: Record<string, string> = { onsite: "On-site", remote: "Remote", hybrid: "Hybrid" };
export const LEVELS: Record<string, string> = { entry: "Entry level", mid: "Mid level", senior: "Senior", any: "Any level" };
export const SALARY_PERIODS: Record<string, string> = { hour: "/hr", day: "/day", month: "/month", year: "/year", project: "/project" };

export const GROUP_CATEGORIES: Record<string, string> = {
  association: "Association",
  club: "Club",
  department: "Department",
  hall: "Hall / Residence",
  faith: "Faith",
  alumni: "Alumni",
  sports: "Sports",
  professional: "Professional",
  other: "Other",
};

export const COURSE_LEVELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all: "All levels",
};

export const LESSON_TYPES: Record<string, string> = {
  video: "Video",
  article: "Article",
  infographic: "Infographic",
  quiz: "Quiz",
  assignment: "Assignment",
  resource: "Resource",
};

export const ORDER_STATUSES: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  ready: "Ready for pickup",
  shipped: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const MEMBER_TYPES: Record<string, string> = { public: "Member of the public", student: "Student", staff: "Staff", alumni: "Alumni" };

export const SELLER_KINDS: Record<string, { label: string; text: string }> = {
  products: { label: "Products", text: "Sell new or used items in the marketplace." },
  food: { label: "Food services", text: "Run a food stall, restaurant or catering menu." },
  events: { label: "Events & tickets", text: "Sell tickets for SRC, association, campus or private events." },
  transport: { label: "Bus trips & rentals", text: "Sell bus seats and rent out buses/vehicles." },
  exhibitions: { label: "Exhibitions", text: "Organise fairs and sell exhibitor booths." },
};
