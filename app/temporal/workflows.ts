import { proxyActivities } from "@temporalio/workflow";
// Only import the activity types
import type * as activities from "./activities";

const { calculateValue, getHemnetData } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

/** A workflow that simply calls an activity */
export async function propertevaluate(address: string): Promise<{
  confidence: number;
  maxValue: number;
  technicalData: number;
}> {
  const marketData = await getHemnetData(address);

  const propertyDetails = await getPropertyDetails();

  const technicalData = await getTechnicalData();

  const { confidence, maxValue, minValue } = await calculateValue({
    marketData,
    propertyDetails,
    technicalData,
  });

  return { confidence, maxValue, minValue };
}
