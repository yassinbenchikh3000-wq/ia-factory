let userConfig = {
  apiKey: "",
  theme: "cyberpunk",
  color: "#ff3ca6",
};

// ======================
// API KEY FUNCTIONS
// ======================
export function setApiKey(key: string) {
  userConfig.apiKey = key;
}

export function getApiKey() {
  return userConfig.apiKey;
}

// ======================
// THEME FUNCTIONS
// ======================
export function setTheme(theme: string) {
  userConfig.theme = theme;
}

export function getTheme() {
  return userConfig.theme;
}

// ======================
// COLOR FUNCTIONS
// ======================
export function setColor(color: string) {
  userConfig.color = color;
}

export function getColor() {
  return userConfig.color;
}