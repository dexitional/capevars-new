// Query-cache key for the signed-in admin, which the admin layout remembers
// briefly between page changes (routes/admin/_admin/route.tsx). Pages that
// change the admin's own details drop it so the layout re-reads them.
export const ADMIN_SESSION_KEY = ["admin-session"];
