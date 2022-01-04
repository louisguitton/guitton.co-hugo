/**
 * Cache in seconds for Google Analytics API.
 * Quotas are 50k requests per day, 1200 per minute.
 * But I think that Google Analytics data updates daily only anyway,
 * so any request more frequent than 24 * 60 * 60 seconds will result in the same data.
 * 
 * Reference:
 * - https://console.cloud.google.com/apis/api/analyticsdata.googleapis.com/quotas?project=guitton-co-1558038055747
 */
export const cacheConfig = {
  backend: 1 * 60,
  frontend: 3,
};
