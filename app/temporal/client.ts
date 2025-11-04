"use server";

import { Connection, Client } from "@temporalio/client";
import type { propertevaluate } from "./workflows";
import { nanoid } from "nanoid";

export async function run(args: string) {
  // Connect to the default Server location
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS,
    apiKey: process.env.TEMPORAL_API_KEY,
    tls: true,
  });
  // In production, pass options to configure TLS and other settings:
  // {
  //   address: 'foo.bar.tmprl.cloud',
  //   tls: {}
  // }

  const client = new Client({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE,
    // namespace: 'foo.bar', // connects to 'default' namespace if not specified
  });

  const handle = await client.workflow.start<typeof propertevaluate>(
    "propertyvaluate",
    {
      taskQueue: "hello-world",
      // type inference works! args: [name: string]
      args: [args],
      // in practice, use a meaningful business ID, like customerId or transactionId
      workflowId: "workflow-" + nanoid(),
    }
  );
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  return await handle.result(); // Hello, Temporal!
}
