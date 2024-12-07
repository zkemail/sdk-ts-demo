import fs from "fs/promises";
import zkeSDK, { ExternalInputInput, ProofStatus } from "@zk-email/sdk";

// Copy slug from UI homepage
const blueprintSlug = "wryonik/twitter@v2";

async function main() {
  const sdk = zkeSDK();

  // Get an instance of Blueprint
  const blueprint = await sdk.getBlueprint(blueprintSlug);

  // Create a prover from the blueprint
  const prover = blueprint.createProver();

  // Get eml
  const eml = (await fs.readFile("emls/twitter-password-reset.eml")).toString();
  const externalInputs: ExternalInputInput[] = [
    {
      maxLength: 64,
      name: "address",
      value: "0x0000000000000000000000000000000000000000",
    },
  ];

  // Generate a proof request and don't wait till it is done.
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
  const { proofData, publicData, externalInputs: externalInputsData, publicOutputs } = proof.getProofData();
  const callData = await proof.createCallData();
  console.log("proof: ", proofData);
  console.log("public data: ", publicData);
  console.log("external inputs: ", externalInputsData);
  console.log("public outputs: ", publicOutputs);
  console.log("callData: ", callData);
  console.log("verifier address: ", blueprint?.props.verifierContract?.address);
}

main();
