import zkeSdk from "@zk-email/sdk";
import {initNoirWasm} from "@zk-email/sdk/initNoirWasm";

const blueprintSlug = "DimiDumo/residency_sp1_noir@v2";
const sdk = zkeSdk({ baseUrl: "https://staging-conductor.zk.email" });

export function setupEmailValidator(element: HTMLElement) {
  let emailContent = "";

  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      emailContent = text;
    };
    reader.readAsText(file);
  };

  const proveInBrowser = async () => {
    if (!emailContent) {
      alert("Please provide an email first");
      return;
    }
    try {
      // Fetch blueprint
      const blueprint = await sdk.getBlueprint(blueprintSlug);
      
      // Initialize local prover
      const prover = blueprint.createProver({ isLocal: true });

      // Noir must be initialized seperately
      const noirWasm = await initNoirWasm();
      const options = { noirWasm };
      
      // External inputs are only required if defined in the blueprint
      const externalInputs = [{ name: "eth_address", value: "0x0" }];
      
      console.log("Generating proof with Noir");
      const proof = await prover.generateProof(emailContent, externalInputs, options);
      console.log("Got proof");

      const verified = await proof.verify(options);
      console.log("Proof was verified: ", verified);
    } catch (err) {
      console.error("Could not parse email in frontend: ", err);
    }
  };

  const proveOnServer = async () => {
    if (!emailContent) {
      alert("Please provide an email first");
      return;
    }
    try {
      // Fetch blueprint
      const blueprint = await sdk.getBlueprint(blueprintSlug);

      // Initialize local prover
      const prover = blueprint.createProver();
      
      // External inputs are only required if defined in the blueprint
      const externalInputs = [{ name: "eth_address", value: "0x0" }];

      console.log("Generating proof with SP1");
      const proof = await prover.generateProof(emailContent, externalInputs);
      console.log("Got proof: ", proof);

      const verified = await proof.verify();
      console.log("Proof was verified: ", verified);
    } catch (err) {
      console.error("Could not parse email in frontend: ", err);
    }
  };

  // Select the input element specifically and use 'change' event
  const fileInput = element.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.addEventListener("change", handleFileUpload);
  }

  const proveInBrowserButton = element.querySelector(
    "button.proof-client-side"
  );
  const proveOnServerButton = element.querySelector("button.proof-server-side");
  if (proveInBrowserButton) {
    proveInBrowserButton.addEventListener("click", proveInBrowser);
  }
  if (proveOnServerButton) {
    proveOnServerButton.addEventListener("click", proveOnServer);
  }
}
