// LeadGen onboarding for students: when a student account first opens
// LeadGen, it picks a campaign target, which unlocks free every Capevars
// private lead list tagged with that target's id. Admins tag the lists.

export const LEADGEN_CAMPAIGNS = [
  { id: "ucc-src", label: "UCC SRC" },
  { id: "ucc-adehye", label: "UCC Adehye" },
  { id: "ucc-oguaa", label: "UCC Oguaa" },
  { id: "ucc-valco", label: "UCC Valco" },
  { id: "ucc-casford", label: "UCC Casford" },
  { id: "ucc-atl", label: "UCC ATL" },
  { id: "ucc-knh", label: "UCC KNH" },
  { id: "ucc-psi", label: "UCC PSI" },
  { id: "ucc-srchall", label: "UCC SRC Hall" },
  { id: "ucc-supernuation", label: "UCC Superannuation" },
  { id: "ucc-grasag", label: "UCC GRASAG" },
] as const;

export type LeadgenCampaignId = (typeof LEADGEN_CAMPAIGNS)[number]["id"];
export const LEADGEN_CAMPAIGN_IDS = LEADGEN_CAMPAIGNS.map((c) => c.id) as [LeadgenCampaignId, ...Array<LeadgenCampaignId>];

// Tags on Capevars' private lists are matched exactly, so they are kept
// lowercase with hyphens for spaces, and each appears once.
export const normalizeTag = (tag: string) => tag.trim().toLowerCase().replace(/\s+/g, "-");
export const uniqueTags = (tags: Array<string>) => [...new Set(tags.map(normalizeTag).filter(Boolean))];
