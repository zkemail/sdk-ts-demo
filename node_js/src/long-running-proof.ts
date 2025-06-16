import zkeSDK, { ProofStatus } from "@zk-email/sdk";
import fs from "fs/promises";

// Copy slug from UI homepage
const blueprintSlug = "DimiDumo/residency_sp1_noir@v1";

async function main() {
  const sdk = zkeSDK({ baseUrl: "https://staging-conductor.zk.email" });

  // Get an instance of Blueprint
  const blueprint = await sdk.getBlueprint(blueprintSlug);

  // Create a prover from the blueprint
  const prover = blueprint.createProver();

  // Get eml
  const eml = (await fs.readFile("../emls/residency.eml")).toString();

  // External inputs are only required if defined in the blueprint
  const externalInputs = [{ name: "eth_address", value: "0x0" }];
  
  // Generate a proof request. Does not wait till the proof is done
  const proof = await prover.generateProofRequest(eml, externalInputs);

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
  
  // Optional: Verify the proof
  const verified = await proof.verify();
  console.log("proof verified: ", verified);
}

main().then(() => process.exit(0)).catch(() => process.exit(1));
