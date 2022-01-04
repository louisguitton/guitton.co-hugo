import type { NextApiRequest, NextApiResponse } from "next";
import { getGoogleAnalyticsPageViews } from "../../../lib/google";
import { SitePageViewsData } from "../../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SitePageViewsData>
) {
  // YYYY-MM-DD or relative by using today, yesterday, or the NdaysAgo
  // Ref: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange
  const startDate = (req.query.startDate as string) || "365daysAgo";
  const raw = req.query.raw === "true" || false;

  const result = await getGoogleAnalyticsPageViews(startDate, raw);

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1200, stale-while-revalidate=600"
  );

  return res.status(200).json(result);
}
