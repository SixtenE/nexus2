import { proxyActivities } from "@temporalio/workflow";
// Only import the activity types
import type * as activities from "./activities";

const { getHemnetData, getPropertyDetails, getTechnicalData, calculateValue } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: "1 minute",
  });

/** A workflow that simply calls an activity */
export async function example(address: string) {
  const marketData = await getHemnetData(address);

  const propertyDetails = await getPropertyDetails(address);

  const technicalData = await getTechnicalData(address);

  const { confidence, maxValue, minValue } = await calculateValue({
    marketData,
    propertyDetails,
    technicalData,
  });

  return { confidence, maxValue, minValue };
}
