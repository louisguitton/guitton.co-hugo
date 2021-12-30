// Ref: https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries#node.js
// Ref: https://googleapis.dev/nodejs/analytics-data/latest/index.html
// Ref: https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { NextApiRequest, NextApiResponse } from "next";

type PageView = {
  page: string;
  title: string;
  views: number;
  since: string;
};
type Data = PageView[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // YYYY-MM-DD or relative by using today, yesterday, or the NdaysAgo
  // Ref: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange
  const startDate = (req.query.startDate as string) || "30daysAgo";
  const limit = parseInt(req.query.limit as string) || 3;
  const raw = req.query.raw === "true" || false;

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
      { name: "pageTitle" },
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
          matchType: 6, // 6 = partial regex
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
    title: p.dimensionValues![1].value!,
    views: parseInt(p.metricValues![0].value!),
    since: startDate,
  }));

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1200, stale-while-revalidate=600"
  );

  return res.status(200).json(result);
}
