import { DateTime } from 'luxon'

export function formatDate(isoTimestamp) {
  const timestamp = new Date(isoTimestamp);
  const year = timestamp.getFullYear();
  const month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
  const day = ("0" + timestamp.getDate()).slice(-2);
  const hours = ("0" + timestamp.getHours()).slice(-2);
  const minutes = ("0" + timestamp.getMinutes()).slice(-2);
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export function reformatDate(normalTime) {
  const year = normalTime.getFullYear();
  const month = String(normalTime.getMonth() + 1).padStart(2, '0');
  const day = String(normalTime.getDate()).padStart(2, '0');
  const hours = String(normalTime.getHours()).padStart(2, '0');
  const minutes = String(normalTime.getMinutes()).padStart(2, '0');
  const seconds = String(normalTime.getSeconds()).padStart(2, '0');
  const milliseconds = String(normalTime.getMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export function getTimeInRegion(region) {
  return DateTime.now().setZone(region).toISO();
}