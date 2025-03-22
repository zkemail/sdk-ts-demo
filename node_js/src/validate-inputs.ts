import zkeSDK, { parseEmail, testBlueprint } from "@zk-email/sdk";
import fs from "fs/promises";

// Copy slug from UI homepage
const blueprintSlug = "DimiDumo/SuccinctZKResidencyInvite@v3";

async function main() {
  // Get eml
  const eml = (await fs.readFile("../emls/residency.eml")).toString();

  // Check if an email is valid - Use parsedEmail to get specific information
  try {
    const parsedEmail = await parseEmail(eml);
    console.log("email header: ", parsedEmail.headers);
  } catch (err) {
    console.error("Failed to parse email: ", err);
  }

  const sdk = zkeSDK();

  // Get an instance of Blueprint
  const blueprint = await sdk.getBlueprint(blueprintSlug);

  // Get test outputs from an email applied to a blueprint, will throw on an invalid email
  // This does not start any proof generation
  try {
    // If the third function param is true, it will also output the isPublic: false fields
    const outputs = await testBlueprint(eml, blueprint.props, false);
    console.log(`outputs from '${blueprint.props.title}' blueprint:`, outputs);
  } catch (err) {
    console.error("Got an error while testing the blueprint: ", err);
  }
}

main();
