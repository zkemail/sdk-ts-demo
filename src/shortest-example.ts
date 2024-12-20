import zkeSDK, { ExternalInputInput } from "@zk-email/sdk";
import fs from "fs/promises";

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
  
  // Generate and wait until proof is generated, can take up to a few minutes
  // remove `externalInputs` if the blueprint you are using does not require external inputs
  const proof = await prover.generateProof(eml, externalInputs);
  const {
    proofData,
    publicData,
    externalInputs: externalInputsData,
    publicOutputs,
  } = proof.getProofData();

  const callData = await proof.createCallData();

  console.log("proof: ", proofData);
  console.log("public: ", publicData);
  console.log("external inputs: ", externalInputsData);
  console.log("public outputs: ", publicOutputs);
  console.log("callData: ", callData);
  console.log("verifier address: ", blueprint?.props.verifierContract?.address);
}

main();
