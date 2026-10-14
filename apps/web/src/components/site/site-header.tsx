import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Bell,
  BookOpen,
  BookOpenCheck,
  Briefcase,
  Building2,
  ChefHat,
  ChevronDown,
  CirclePlus,
  Compass,
  Contact,
  Flag,
  GraduationCap,
  Heart,
  Hotel,
  Landmark,
  Library,
  ListChecks,
  LogOut,
  Menu,
  MessageCircle,
  MessagesSquare,
  Newspaper,
  Package,
  Presentation,
  Search,
  Send,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  Ticket,
  User,
  UserPlus,
  UserRound,
  Users,
  UtensilsCrossed,
  Wallet,
  X,
} from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { timeAgo } from "#/lib/format";
import { useMember, useSession } from "#/hooks/useMember";
import { useCart } from "#/hooks/useCart";
import { Avatar, Logo } from "./kit";
import { SystemLogo, SystemMark } from "./system-logo";
import type { SystemKey } from "./system-logo";

type IconType = React.ComponentType<{ className?: string }>;

export interface NavSystem {
  key: Exclude<SystemKey, "home">;
  label: string;
  short: string;
  to: string;
  blurb: string;
  links: Array<{
    to: string;
    label: string;
    text: string;
    icon: IconType;
    search?: Record<string, string>;
  }>;
}

// The six platforms. Their logos (system-logo.tsx) are drawn from `key`.
export const SYSTEMS: Array<NavSystem> = [
  {
    key: "market",
    short: "Marketplace",
    label: "Marketplace",
    to: "/market",
    blurb: "Shop trusted student and local sellers.",
    links: [
      {
        to: "/market",
        label: "Shop",
        text: "Electronics, fashion, essentials and more",
        icon: ShoppingBag,
      },
      {
        to: "/market/food",
        label: "Food services",
        text: "Order from campus food vendors",
        icon: UtensilsCrossed,
      },
      {
        to: "/market/tickets",
        label: "E-Tickets",
        text: "Events, bus seats and bus rentals",
        icon: Ticket,
      },
      {
        to: "/market/jobs",
        label: "Job Circle",
        text: "Find jobs, post jobs, hire talent",
        icon: Briefcase,
      },
      {
        to: "/market/exhibitions",
        label: "Exhibitions",
        text: "Fairs, expos and exhibitor booths",
        icon: Presentation,
      },
      {
        to: "/seller",
        label: "Sell on Capevars",
        text: "Open your store in minutes",
        icon: Store,
      },
    ],
  },
  {
    key: "finder",
    short: "Finder",
    label: "The Finder",
    to: "/finder",
    blurb: "Search hostels, hotels, places, people and more.",
    links: [
      {
        to: "/finder/search",
        search: { type: "hostel" },
        label: "Hostels",
        text: "Rooms near campus",
        icon: BedDouble,
      },
      {
        to: "/finder/search",
        search: { type: "hotel" },
        label: "Hotels",
        text: "Stays for visitors",
        icon: Hotel,
      },
      {
        to: "/finder/search",
        search: { type: "restaurant" },
        label: "Restaurants",
        text: "Where to eat",
        icon: ChefHat,
      },
      {
        to: "/finder/search",
        search: { type: "business" },
        label: "Businesses",
        text: "Shops and services",
        icon: Building2,
      },
      {
        to: "/finder/search",
        search: { type: "place" },
        label: "Places",
        text: "Landmarks and spots",
        icon: Landmark,
      },
      {
        to: "/finder/search",
        search: { type: "person" },
        label: "People",
        text: "Professionals and contacts",
        icon: UserRound,
      },
    ],
  },
  {
    key: "groups",
    short: "Groups",
    label: "Campus Groups",
    to: "/groups",
    blurb: "Associations, clubs, halls and communities.",
    links: [
      {
        to: "/groups",
        label: "Discover groups",
        text: "Find your people",
        icon: Compass,
      },
      {
        to: "/groups/mine",
        label: "My groups",
        text: "Groups you belong to",
        icon: Users,
      },
      {
        to: "/groups/new",
        label: "Create a group",
        text: "Start a community",
        icon: CirclePlus,
      },
    ],
  },
  {
    key: "social",
    short: "SocialNet",
    label: "SocialNet",
    to: "/social",
    blurb: "Friends, walls, pages and chats.",
    links: [
      {
        to: "/social",
        label: "News feed",
        text: "What's happening",
        icon: Newspaper,
      },
      {
        to: "/social/friends",
        label: "Friends",
        text: "Requests, find and manage",
        icon: UserPlus,
      },
      {
        to: "/social/pages",
        label: "Pages",
        text: "Follow brands and offices",
        icon: Flag,
      },
      {
        to: "/social/chats",
        label: "Chats",
        text: "Messages and forums",
        icon: MessagesSquare,
      },
    ],
  },
  {
    key: "learn",
    short: "OpenLearn",
    label: "OpenLearn",
    to: "/learn",
    blurb: "Courses by experts — learn or teach.",
    links: [
      {
        to: "/learn/courses",
        label: "Browse courses",
        text: "Hundreds of skills",
        icon: Library,
      },
      {
        to: "/learn/my",
        label: "My learning",
        text: "Continue where you left off",
        icon: BookOpenCheck,
      },
      {
        to: "/learn/teach",
        label: "Teach on OpenLearn",
        text: "Create and sell a course",
        icon: GraduationCap,
      },
    ],
  },
  {
    key: "leadgen",
    short: "LeadGen",
    label: "LeadGen",
    to: "/leadgen",
    blurb: "Community leads and bulk SMS & email.",
    links: [
      {
        to: "/leadgen",
        label: "Leads hub",
        text: "Browse community lead lists",
        icon: Contact,
      },
      {
        to: "/leadgen/portal/broadcast",
        label: "Send a broadcast",
        text: "Bulk SMS or email",
        icon: Send,
      },
      {
        to: "/leadgen/portal/leads",
        label: "My leads",
        text: "Upload, share or sell lists",
        icon: ListChecks,
      },
      {
        to: "/leadgen/portal/wallet",
        label: "Credits & billing",
        text: "Top up broadcast credit",
        icon: Wallet,
      },
      {
        to: "/leadgen/portal/senders",
        label: "Sender IDs",
        text: "Register who messages appear from",
        icon: BadgeCheck,
      },
    ],
  },
];

function isActive(system: NavSystem, pathname: string) {
  return (
    pathname === system.to ||
    pathname.startsWith(`${system.to}/`) ||
    (system.key === "market" && pathname.startsWith("/seller")) ||
    (system.key === "social" && pathname.startsWith("/u/"))
  );
}

function useCounts() {
  const member = useMember();
  return useQuery({
    queryKey: ["counts"],
    queryFn: () =>
      api.get<{
        notifications: number;
        messages: number;
        friendRequests: number;
      }>("/me/counts"),
    enabled: Boolean(member),
    refetchInterval: 45_000,
  });
}

// One platform in the menubar: a tab with its logo. The 28px tile sits 6px
// inside the tab on three sides, and the corners are concentric (tile radius
// ≈ 7.8px + 6px ≈ 14px). The active tab is outlined in cream.
function NavTab({
  system,
  label,
  to,
  active,
}: {
  system: SystemKey;
  label: string;
  to: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group/tab flex h-10 shrink-0 items-center gap-2.5 rounded-[14px] py-1.5 pr-4 pl-1.5 text-[14px] font-semibold xl:pr-5 whitespace-nowrap ring-1 ring-transparent transition ring-inset",
        active
          ? "bg-white/[0.13] text-white ring-brand-cream/80"
          : "text-white/80 hover:bg-white/[0.08] hover:text-white",
      )}
    >
      <SystemLogo
        system={system}
        size="sm"
        className="transition-transform duration-200 group-hover/tab:-rotate-6"
      />
      {label}
    </Link>
  );
}

// A menubar tab with its dropdown (desktop). The panel opens after a short
// pause, so sweeping the pointer across the bar doesn't flash every menu.
function MegaMenu({
  system,
  active,
  align,
}: {
  system: NavSystem;
  active: boolean;
  align: "left" | "center" | "right";
}) {
  return (
    <div className="group relative shrink-0">
      <NavTab system={system.key} label={system.short} to={system.to} active={active} />
      <div
        className={cn(
          "invisible absolute top-full z-50 hidden w-[680px] translate-y-1 pt-3 opacity-0 transition-[opacity,transform,visibility] duration-150 lg:block",
          "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-150",
          { left: "left-0", center: "left-1/2 -translate-x-1/2", right: "right-0" }[align],
        )}
      >
        <div className="grid grid-cols-[220px_1fr] overflow-hidden rounded-2xl bg-white text-foreground shadow-[0_24px_60px_-12px_rgb(0_0_0/0.55),0_0_0_1px_rgb(255_255_255/0.12)]">
          <div className="relative overflow-hidden bg-[#0a2a55] p-5 text-white">
            <SystemMark
              system={system.key}
              className="pointer-events-none absolute -right-10 -bottom-10 size-44 text-white/[0.07] [--mark-knock:#0a2a55]"
            />
            <SystemLogo system={system.key} size="xl" />
            <p className="relative mt-4 font-display text-xl font-black tracking-tight">
              {system.label}
            </p>
            <p className="relative mt-1 text-sm text-white/70">{system.blurb}</p>
            <Link
              to={system.to}
              className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-cream px-3.5 py-1.5 text-xs font-bold text-primary transition hover:bg-brand-butter"
            >
              Open {system.short} <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul className="grid grid-cols-2 content-start gap-1 p-3">
            {system.links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  search={l.search as never}
                  className="group/link flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-brand-cream/45"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.06] text-primary transition group-hover/link:bg-primary group-hover/link:text-brand-cream">
                    <l.icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-sm font-semibold text-primary">{l.label}</span>
                    <span className="block text-xs leading-snug text-muted-foreground">
                      {l.text}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function HeaderSearch({ onOpen }: { onOpen: () => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim().length >= 2) void navigate({ to: "/search", search: { q: q.trim() } });
        else onOpen();
      }}
      className="mx-2 hidden max-w-2xl flex-1 items-center overflow-hidden rounded-full border-2 border-primary/15 bg-muted/60 text-foreground transition focus-within:border-primary focus-within:bg-white md:flex lg:mx-6"
    >
      <Search className="ml-4 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products, hostels, groups, courses, people…"
        aria-label="Search Capevars"
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[15px] outline-none placeholder:text-muted-foreground"
      />
      <kbd className="mr-2 hidden rounded border bg-white px-1.5 text-[10px] font-semibold text-muted-foreground lg:block">
        ⌘K
      </kbd>
      <button
        type="submit"
        className="m-1 rounded-full bg-brand-gold px-6 py-2.5 text-sm font-bold text-primary hover:bg-brand-butter"
      >
        Search
      </button>
    </form>
  );
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-primary/60 p-4 pt-[12vh] text-foreground backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim().length < 2) return;
          onClose();
          void navigate({ to: "/search", search: { q: q.trim() } });
        }}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <Search className="size-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, hostels, groups, courses, people…"
            className="flex-1 bg-transparent text-lg outline-none"
            aria-label="Search Capevars"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted"
            aria-label="Close search"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
          {SYSTEMS.map((s) => (
            <Link
              key={s.key}
              to={s.to}
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl border p-2.5 text-sm font-semibold text-primary hover:bg-accent"
            >
              <SystemLogo system={s.key} size="sm" />
              {s.label}
            </Link>
          ))}
        </div>
      </form>
    </div>
  );
}

interface Notification {
  id: number;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
  actor_name: string | null;
  actor_avatar: string | null;
}

function NotificationsMenu({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get<{ items: Array<Notification>; unread: number }>("/me/notifications"),
    enabled: open,
  });
  const markAll = useMutation({
    mutationFn: () => api.post("/me/notifications/read"),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({ queryKey: ["counts"] });
    },
  });
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <span className="relative">
          <Bell className="size-5" />
          {count > 0 && <Badge n={count} />}
        </span>
      }
      label="Notifications"
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="font-bold text-primary">Notifications</p>
        <button
          type="button"
          onClick={() => markAll.mutate()}
          className="text-xs font-semibold text-info hover:underline"
        >
          Mark all read
        </button>
      </div>
      <ul className="max-h-[420px] overflow-y-auto">
        {!data ? (
          <li className="p-6 text-center text-sm text-muted-foreground">Loading…</li>
        ) : data.items.length === 0 ? (
          <li className="p-6 text-center text-sm text-muted-foreground">You're all caught up.</li>
        ) : (
          data.items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => {
                  void api
                    .post("/me/notifications/read", { id: n.id })
                    .then(() => queryClient.invalidateQueries({ queryKey: ["counts"] }));
                  setOpen(false);
                  if (n.link) void navigate({ to: n.link });
                }}
                className={cn(
                  "flex w-full gap-3 px-4 py-3 text-left hover:bg-muted",
                  !n.read_at && "bg-accent/60",
                )}
              >
                <Avatar src={n.actor_avatar} name={n.actor_name ?? "Capevars"} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">{n.title}</span>
                  {n.body && (
                    <span className="line-clamp-2 block text-xs text-muted-foreground">
                      {n.body}
                    </span>
                  )}
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {timeAgo(n.created_at)}
                  </span>
                </span>
                {!n.read_at && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-info" />}
              </button>
            </li>
          ))
        )}
      </ul>
    </Popover>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
      {n > 99 ? "99+" : n}
    </span>
  );
}

function Popover({
  open,
  onOpenChange,
  trigger,
  label,
  children,
  width = "w-[380px]",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trigger: React.ReactNode;
  label: string;
  children: React.ReactNode;
  width?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-label={label}
        className="flex size-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
      >
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "absolute top-full right-0 z-50 mt-2 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border bg-white text-foreground shadow-2xl",
            width,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const member = useMember()!;
  const { logout } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [pathname]);
  const items: Array<{
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { to: `/u/${member.username}`, label: "My profile", icon: User },
    { to: "/account/orders", label: "Orders", icon: Package },
    { to: "/account/tickets", label: "Tickets & bookings", icon: Ticket },
    { to: "/account/favourites", label: "Favourites", icon: Heart },
    { to: "/groups/mine", label: "My groups", icon: Users },
    { to: "/learn/my", label: "My learning", icon: BookOpen },
    { to: "/market/jobs/mine", label: "My jobs", icon: Briefcase },
    {
      to: member.seller ? "/seller" : "/seller/apply",
      label: member.seller ? "Seller Center" : "Start selling",
      icon: Store,
    },
    { to: "/account", label: "Account settings", icon: Settings },
  ];
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={<Avatar src={member.avatarUrl} name={member.fullName} size="sm" />}
      label="Account menu"
      width="w-72"
    >
      <div className="flex items-center gap-3 border-b p-4">
        <Avatar src={member.avatarUrl} name={member.fullName} />
        <div className="min-w-0">
          <p className="truncate font-bold text-primary">{member.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">@{member.username}</p>
        </div>
      </div>
      <ul className="p-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link
              to={i.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <i.icon className="size-4 text-muted-foreground" /> {i.label}
            </Link>
          </li>
        ))}
        <li className="mt-1 border-t pt-1">
          <button
            type="button"
            onClick={() => void logout().then(() => navigate({ to: "/" }))}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/5"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </li>
      </ul>
    </Popover>
  );
}

// Slim pale-yellow strip above the header: quick links on the left, account
// links (Sign in · Join free, or the member's name) on the right.
export function TopBar() {
  const member = useMember();
  const href = useRouterState({ select: (s) => s.location.href });
  const onAuthPage = /^\/(login|signup)/.test(href);
  return (
    <div className="bg-brand-cream text-primary">
      <div className="mx-auto flex h-7 max-w-7xl items-center gap-4 px-4 text-xs font-normal sm:px-6 lg:px-8">
        <p className="hidden truncate italic md:block">
          One account for Marketplace, Finder, Groups, SocialNet, OpenLearn & LeadGen
        </p>
        <nav className="hidden items-center gap-4 lg:flex" aria-label="Quick links">
          <Link to={member?.seller ? "/seller" : "/seller/apply"} className="hover:underline">
            {member?.seller ? "Seller Center" : "Sell on Capevars"}
          </Link>
          <Link to="/learn/teach" className="hover:underline">
            Teach
          </Link>
          <Link to="/leadgen/portal" className="hover:underline">
            Bulk SMS & Email
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {member ? (
            <Link to="/account" className="rounded-full px-2.5 py-0.5 font-semibold hover:bg-primary/10">
              Hi, {member.fullName.split(" ")[0]}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                search={onAuthPage ? undefined : { next: href }}
                className="rounded-full px-3 py-0.5 hover:bg-primary/10"
              >
                Sign in
              </Link>
              <span className="text-primary/40" aria-hidden="true">
                |
              </span>
              <Link
                to="/signup"
                search={onAuthPage ? undefined : { next: href }}
                className="rounded-full px-3 py-0.5 hover:bg-primary/10"
              >
                Join free
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const member = useMember();
  const { count } = useCart();
  const { data: counts } = useCounts();
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => setDrawer(false), [pathname]);
  // On narrow screens the menubar scrolls sideways: bring the current platform into view.
  useEffect(() => {
    const nav = navRef.current;
    const tab = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !tab || nav.scrollWidth <= nav.clientWidth) return;
    // Measured on screen: each tab sits inside its dropdown wrapper, so offsetLeft isn't relative to the bar.
    const offset = tab.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft;
    nav.scrollTo({ left: offset - (nav.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const iconButton =
    "relative flex size-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary";

  return (
    <header className="sticky top-0 z-40 shadow-[0_10px_30px_-14px_rgb(4_29_64/0.6)]">
      {/* Brand row, on white: logo, search, account. */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className={cn(iconButton, "-ml-2 lg:hidden")}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <Link to="/" className="shrink-0" aria-label="Capevars home">
            <Logo />
          </Link>
          <HeaderSearch onOpen={() => setSearchOpen(true)} />
          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(iconButton, "md:hidden")}
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>
            <Link to="/market/cart" className={iconButton} aria-label={`Cart, ${count} items`}>
              <span className="relative">
                <ShoppingCart className="size-5" />
                {count > 0 && <Badge n={count} />}
              </span>
            </Link>
            {member ? (
              <>
                <Link
                  to="/social/chats"
                  className={cn(iconButton, "hidden sm:flex")}
                  aria-label="Chats"
                >
                  <span className="relative">
                    <MessageCircle className="size-5" />
                    {counts?.messages ? <Badge n={counts.messages} /> : null}
                  </span>
                </Link>
                <NotificationsMenu count={counts?.notifications ?? 0} />
                <AccountMenu />
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* The menubar, on navy: Home and the six platforms, each with its logo. */}
      <div className="relative border-b border-brand-cream/25 bg-primary text-white">
        {/* Soft light across the navy, so the bar has depth rather than a flat fill. */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_120px_at_15%_-30%,rgb(255_239_170/0.16),transparent_70%),radial-gradient(600px_120px_at_90%_140%,rgb(245_184_20/0.12),transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"
          aria-hidden="true"
        />
        {/* A bubble of pale-yellow light glides along the bottom edge, left to right, on a loop (styles.css). */}
        <div className="edge-bubble-track" aria-hidden="true">
          <div className="edge-bubble" />
        </div>
        <nav
          ref={navRef}
          className="no-scrollbar relative mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-3 py-3 sm:px-5 lg:overflow-visible lg:px-7 xl:gap-2"
          aria-label="Main"
        >
          <NavTab system="home" label="Home" to="/" active={pathname === "/"} />
          <span className="mx-1.5 h-6 w-px shrink-0 bg-white/15" aria-hidden="true" />
          {SYSTEMS.map((s, i) => (
            <MegaMenu
              key={s.key}
              system={s}
              active={isActive(s, pathname)}
              align={i < 2 ? "left" : i < 4 ? "center" : "right"}
            />
          ))}
          <Link
            to={member?.seller ? "/seller" : "/seller/apply"}
            className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-xl bg-brand-gold px-4 py-2 text-xs font-black text-primary shadow-[0_4px_14px_-4px_rgb(245_184_20/0.7)] transition hover:bg-brand-butter xl:flex"
          >
            <Store className="size-3.5" />
            {member?.seller ? "Seller Center" : "Start selling"}
          </Link>
        </nav>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      {drawer && (
        <div className="fixed inset-0 z-50 text-foreground lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-primary/60"
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
          />
          <div className="relative flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-white animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b p-4">
              <Logo />
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 p-3">
              <Link
                to="/"
                className="mb-1 flex items-center gap-3 rounded-xl p-2.5 font-semibold text-primary hover:bg-muted"
              >
                <SystemLogo system="home" size="md" />
                Home
              </Link>
              {SYSTEMS.map((s) => (
                <details key={s.key} className="group mb-1 rounded-xl" open={isActive(s, pathname)}>
                  <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl p-2.5 font-semibold text-primary hover:bg-muted">
                    <SystemLogo system={s.key} size="md" />
                    {s.label}
                    <ChevronDown className="ml-auto size-4 transition group-open:rotate-180" />
                  </summary>
                  <ul className="mb-2 ml-[3.4rem] space-y-0.5">
                    {s.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          to={l.to}
                          search={l.search as never}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-brand-cream/45 hover:text-primary"
                        >
                          <l.icon className="size-4" />
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </nav>
            {!member && (
              <div className="grid grid-cols-2 gap-2 border-t p-4">
                <Link
                  to="/login"
                  className="rounded-full border px-4 py-2.5 text-center text-sm font-semibold"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Join free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// Secondary navigation inside a platform (e.g. Marketplace → Shop · Food · E-Tickets …),
// led by the platform's logo and name.
export function SystemNav({
  systemKey,
  extra,
}: {
  systemKey: NavSystem["key"];
  extra?: React.ReactNode;
}) {
  const system = SYSTEMS.find((s) => s.key === systemKey)!;
  return (
    <div className="border-b border-border bg-white">
      <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={system.to}
          className="mr-3 flex shrink-0 items-center gap-2.5 border-r border-border py-2 pr-7"
        >
          <SystemLogo system={system.key} size="sm" />
          {/* The platform's name, signed in script with a gold brush stroke under it. */}
          <span className="relative pb-1 font-script text-[25px] leading-none font-bold whitespace-nowrap text-primary">
            {system.label}
            <svg
              viewBox="0 0 100 8"
              preserveAspectRatio="none"
              className="absolute inset-x-0 -bottom-1 h-2 w-full text-brand-gold"
              aria-hidden="true"
            >
              <path d="M2 5.6C24 2.4 58 1.6 98 3.6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          </span>
        </Link>
        {system.links.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            search={l.search as never}
            activeOptions={{
              exact: l.to === system.to,
              includeSearch: Boolean(l.search),
            }}
            className="relative shrink-0 px-3 py-3 text-sm font-semibold text-muted-foreground hover:text-primary [&.active]:text-primary [&.active]:after:absolute [&.active]:after:inset-x-2 [&.active]:after:bottom-0 [&.active]:after:h-0.5 [&.active]:after:rounded-full [&.active]:after:bg-brand-gold"
          >
            {l.label}
          </Link>
        ))}
        {extra && <div className="ml-auto shrink-0 py-2">{extra}</div>}
      </div>
    </div>
  );
}
