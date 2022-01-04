import type { NextApiRequest, NextApiResponse } from "next";
import { cacheConfig } from "../../../lib/constants";
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
    `public, s-maxage=${cacheConfig.backend}, stale-while-revalidate=${
      cacheConfig.backend * 2
    }`
  );

  return res.status(200).json(result);
}
