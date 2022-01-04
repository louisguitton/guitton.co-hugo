/** Google Analyticcs v4 API client
 *
 * References:
 * - https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries#node.js
 * - https://googleapis.dev/nodejs/analytics-data/latest/index.html
 * - https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema
 */
import { BetaAnalyticsDataClient, protos } from "@google-analytics/data";
import { FeaturedPostsData, SitePageViewsData } from "./types";

/**
 * Calls Google Analytics v4 API to fetch the most read posts.
 * @param startDate YYYY-MM-DD or relative expression one of 'today', 'yesterday', or the 'NdaysAgo'
      Ref: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange
 * @param limit number of most read posts to return
 * @param raw whether or not to log the raw Google API response
 * @returns `limit` posts that are the most read since `startDate`
 */
export async function getGoogleAnalyticsFeaturedPosts(
  startDate: string = "30daysAgo",
  limit: number = 3,
  raw: boolean = false
): Promise<FeaturedPostsData> {
  const propertyId = "256193208";

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
  });

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: startDate,
        endDate: "today",
      },
    ],
    dimensions: [
      {
        name: "pagePath",
      },
    ],
    metrics: [
      {
        name: "screenPageViews",
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType:
            protos.google.analytics.data.v1beta.Filter.StringFilter.MatchType
              .PARTIAL_REGEXP,
          value: "posts",
        },
      },
    },
    limit: limit,
  });

  if (raw) {
    console.log(response);
  }

  const result = response.rows!.map((p) => ({
    page: p.dimensionValues![0].value!,
    views: parseInt(p.metricValues![0].value!),
    since: startDate,
  }));

  return result;
}

/**
 * Calls Google Analytics v4 API to fetch the site page views.
 * @param startDate YYYY-MM-DD or relative expression one of 'today', 'yesterday', or the 'NdaysAgo'
      Ref: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange
 * @param raw whether or not to log the raw Google API response
 * @returns the page views for the site since `startDate`
 */
export async function getGoogleAnalyticsPageViews(
  startDate: string = "365daysAgo",
  raw: boolean = false
): Promise<SitePageViewsData> {
  const propertyId = "256193208";

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
  });

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: startDate,
        endDate: "today",
      },
    ],
    dimensions: [],
    metrics: [
      {
        name: "screenPageViews",
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType:
            protos.google.analytics.data.v1beta.Filter.StringFilter.MatchType
              .PARTIAL_REGEXP,
          value: "posts",
        },
      },
    },
  });

  if (raw) {
    console.log(response);
  }

  const result = {
    pageViews: parseInt(response.rows![0].metricValues![0].value!),
    since: startDate,
  };

  return result;
}
