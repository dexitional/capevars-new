import type { AdminRole } from "@cv/db";

// The admin role matrix — the single source of truth for who can see and
// change each part of the universal admin portal. API guards
// (requirePermission), the sidebar, route guards and edit controls all read
// from here.
//
//   "view"   — can open the pages and read the records
//   "manage" — can also approve, edit and delete
//
// Roles without an entry for a module can't reach it at all.

export type AdminModule =
  | "dashboard"
  | "members"
  | "sellers"
  | "products"
  | "orders"
  | "tickets"
  | "jobs"
  | "exhibitions"
  | "finder"
  | "groups"
  | "social"
  | "learn"
  | "leadgen"
  | "categories"
  | "reports"
  | "payments"
  | "media"
  | "settings"
  | "users"
  | "activity";

export type Access = "view" | "manage";

const ALL_MODULES: Array<AdminModule> = [
  "dashboard",
  "members",
  "sellers",
  "products",
  "orders",
  "tickets",
  "jobs",
  "exhibitions",
  "finder",
  "groups",
  "social",
  "learn",
  "leadgen",
  "categories",
  "reports",
  "payments",
  "media",
  "settings",
  "users",
  "activity",
];

const MODERATION: Partial<Record<AdminModule, Access>> = {
  dashboard: "view",
  members: "view",
  sellers: "manage",
  products: "manage",
  orders: "view",
  tickets: "manage",
  jobs: "manage",
  exhibitions: "manage",
  finder: "manage",
  groups: "manage",
  social: "manage",
  learn: "manage",
  leadgen: "manage",
  reports: "manage",
  media: "manage",
};

const PERMISSIONS: Record<AdminRole, Partial<Record<AdminModule, Access>>> = {
  super_admin: Object.fromEntries(ALL_MODULES.map((m) => [m, "manage"])),
  admin: {
    ...Object.fromEntries(ALL_MODULES.map((m) => [m, "manage"])),
    users: undefined,
    activity: "view",
  },
  // Approves sellers, groups, courses, listings and jobs; handles reports.
  moderator: MODERATION,
  // Curates content: Finder listings, jobs, courses, categories and the home page.
  editor: {
    dashboard: "view",
    finder: "manage",
    jobs: "manage",
    learn: "manage",
    categories: "manage",
    media: "manage",
    settings: "manage",
  },
  // Customer support: read-only across members, orders, tickets and payments.
  support: {
    dashboard: "view",
    members: "view",
    sellers: "view",
    orders: "view",
    tickets: "view",
    payments: "view",
    reports: "view",
    leadgen: "view",
  },
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  moderator: "Moderator",
  editor: "Editor",
  support: "Support",
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: "Everything, including admin accounts.",
  admin: "Every system, settings and payments; not admin accounts.",
  moderator: "Approvals and moderation across all six systems.",
  editor: "Finder, jobs, courses, categories, media and home page.",
  support: "Read-only access to members, orders, tickets and payments.",
};

export const ADMIN_ROLES = Object.keys(ROLE_LABELS) as Array<AdminRole>;

export function accessTo(role: AdminRole, module: AdminModule): Access | null {
  return PERMISSIONS[role][module] ?? null;
}

export const canView = (role: AdminRole, module: AdminModule) => accessTo(role, module) !== null;
export const canManage = (role: AdminRole, module: AdminModule) =>
  accessTo(role, module) === "manage";

export function rolesWith(module: AdminModule, level: Access): Array<AdminRole> {
  return ADMIN_ROLES.filter((role) =>
    level === "view" ? canView(role, module) : canManage(role, module),
  );
}

// Where each module lives, in sidebar order. The first one a role can view is
// where they land after signing in.
export const MODULE_PATHS: Array<[AdminModule, string]> = [
  ["dashboard", "/admin"],
  ["members", "/admin/members"],
  ["sellers", "/admin/sellers"],
  ["products", "/admin/products"],
  ["orders", "/admin/orders"],
  ["tickets", "/admin/tickets"],
  ["jobs", "/admin/jobs"],
  ["exhibitions", "/admin/exhibitions"],
  ["finder", "/admin/finder"],
  ["groups", "/admin/groups"],
  ["social", "/admin/social"],
  ["learn", "/admin/learn"],
  ["leadgen", "/admin/leadgen"],
  ["categories", "/admin/categories"],
  ["reports", "/admin/reports"],
  ["payments", "/admin/payments"],
  ["media", "/admin/media"],
  ["settings", "/admin/settings"],
  ["users", "/admin/users"],
  ["activity", "/admin/activity"],
];

export function homePathFor(role: AdminRole): string {
  return MODULE_PATHS.find(([module]) => canView(role, module))?.[1] ?? "/admin/account";
}
