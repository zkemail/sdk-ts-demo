import fs from "fs/promises";
import zkeSDK, { ProofStatus } from "@zk-email/sdk";

// Copy slug from UI homepage
const blueprintSlug = "DimiDumo/SuccinctZKResidencyInvite@v3";

async function main() {
  const sdk = zkeSDK();

  // Get an instance of Blueprint
  const blueprint = await sdk.getBlueprint(blueprintSlug);

  // Create a prover from the blueprint
  const prover = blueprint.createProver();

  // Get eml
  const eml = (await fs.readFile("../emls/residency.eml")).toString();

  // Generate a proof request and don't wait till it is done.
  const proof = await prover.generateProofRequest(eml);

  // Check the status of the proof
  // It will be InProgress after starting
  let status = await proof.checkStatus();
  // Should be InProgress
  console.log(
    "Initial Status is in progress: ",
    status === ProofStatus.InProgress
  );

  // You can now either manually use checkStatus in interval or use waitForCompletion
  status = await proof.waitForCompletion();
  if (status === ProofStatus.Failed) {
    throw new Error("Failed to generate proof");
  }

  // Get the proof data
  const { proofData, publicData } = proof.getProofData();
  console.log("proof: ", proofData);
  console.log("public data: ", publicData);
}

main();
