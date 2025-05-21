/**
 * An array of routes that are accesible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/verification-email"];

/**
 * An array of routes that are used for authentication
 * These routes do not require authentication
 * @type {string[]}
 */
export const authRoutes = ["/sign-in", "/register", "/error"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purpose
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard/home";
