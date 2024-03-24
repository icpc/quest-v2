export function setItemWithExpiry(key: string, value: any, ttl: number) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item));
}

// Get item with checking expiry
export function getItemWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
        return null;
    }
    try {
        const item = JSON.parse(itemStr);
        const now = new Date();
        // compare the expiry time of the item with the current time
        if (item &&now.getTime() > item?.expiry) {
            // If the item is expired, delete the item from storage and return null
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    } catch (e) {
        console.log(e);
        return null;
    }

}

export function checkUserAuthentication() {
    const isAuthenticated = getItemWithExpiry("isAuthenticated");
    if (isAuthenticated) {
      return true;
    }
    return false;
}