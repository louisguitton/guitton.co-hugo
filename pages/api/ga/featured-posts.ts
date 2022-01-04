import type { NextApiRequest, NextApiResponse } from "next";
import { cacheConfig } from "../../../lib/constants";
import { getGoogleAnalyticsFeaturedPosts } from "../../../lib/google";
import { FeaturedPostsData } from "../../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeaturedPostsData>
) {
  // YYYY-MM-DD or relative by using today, yesterday, or the NdaysAgo
  // Ref: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange
  const startDate = (req.query.startDate as string) || "30daysAgo";
  const limit = parseInt(req.query.limit as string) || 3;
  const raw = req.query.raw === "true" || false;

  const result = await getGoogleAnalyticsFeaturedPosts(startDate, limit, raw);

  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${cacheConfig.backend}, stale-while-revalidate=${
      cacheConfig.backend * 2
    }`
  );

  return res.status(200).json(result);
}
