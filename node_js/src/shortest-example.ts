import zkeSDK from "@zk-email/sdk";
import fs from "fs/promises";

// Copy slug from UI homepage
const blueprintSlug = 'DimiDumo/residency_sp1_noir@v1';

async function main() {
  const sdk = zkeSDK({ baseUrl: "https://staging-conductor.zk.email" });

  // Get an instance of Blueprint
  const blueprint = await sdk.getBlueprint(blueprintSlug);

  // Create a prover from the blueprint
  const prover = blueprint.createProver();

  // Get eml
  const eml = (await fs.readFile('../emls/residency.eml')).toString();
  
  // External inputs are only required if defined in the blueprint
  const externalInputs = [{ name: "eth_address", value: "0x0" }];

  // Generate and wait until proof is generated, can take up to a few minutes
  const proof = await prover.generateProof(eml, externalInputs);
  console.log("proof: ", proof);
  
  const { proofData, publicData } = proof.getProofData();
  console.log('proof: ', proofData);
  console.log('public: ', publicData);
  
  // Optional: Verify the proof
  const verified = await proof.verify();
  console.log("proof verified: ", verified);
}

main().then(() => process.exit(0)).catch(() => process.exit(1));
