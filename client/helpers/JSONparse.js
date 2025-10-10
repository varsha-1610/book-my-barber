function jsonParseUserDataString() {
  const dataString = localStorage.getItem("persist:client");
  if (!dataString) return null;

  try {
    const parsed = JSON.parse(dataString);

    // User is stored in key "user", may be null or string
    const userData = parsed?.user;
    if (!userData) return null;

    // If stringified, parse it
    return typeof userData === "string" ? JSON.parse(userData) : userData;
  } catch (err) {
    console.error("Error parsing user data:", err);
    return null;
  }
}

function jsonParseShopDataString() {
  const dataString = localStorage.getItem("persist:client");
  if (!dataString) return null;

  try {
    const parsed = JSON.parse(dataString);

    // Shop is stored in key "shop", may be null or string
    const shopData = parsed?.shop;
    if (!shopData) return null;

    // If stringified, parse it
    return typeof shopData === "string" ? JSON.parse(shopData) : shopData;
  } catch (err) {
    console.error("Error parsing shop data:", err);
    return null;
  }
}

export { jsonParseUserDataString, jsonParseShopDataString };
