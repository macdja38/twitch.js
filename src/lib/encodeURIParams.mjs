export function encodeHelixObject(object) {
  return `?${Object.entries(object).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map(v => encodeKeyValue(key, v))
    } else {
      return [encodeKeyValue(key, value)];
    }
  }).reduce((a, b) => a.concat(b), []).join("&")}`
}

export function encodeKrakenObject(object) {
  return `?${Object.entries(object).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${encodeURIComponent(key)}=${value.map(v => encodeURIComponent(v)).join(",")}`
    } else {
      return encodeKeyValue(key, value);
    }
  }).join("&")}`
}

function encodeKeyValue(key, value) {
  return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}