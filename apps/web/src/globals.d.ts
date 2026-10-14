// Build-time constants injected by vite.config.ts (`define`).

/** Image hosts the /img optimiser accepts (R2_PUBLIC_DOMAIN + IMAGE_REMOTE_HOSTS). */
declare const __IMAGE_HOSTS__: Array<string>;

/** Optional CDN origin for /files and /img URLs (CDN_URL), e.g. "https://cdn.capevars.com". */
declare const __CDN_URL__: string;
