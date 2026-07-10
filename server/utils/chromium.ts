/** Returns the Chromium/Chrome executable path for the current platform. */
export function getChromiumPath(): string {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  // Alpine Linux (Docker)
  return "/usr/bin/chromium-browser";
}
