import zkeSdk from "@zk-email/sdk";

const blueprintSlug = "DimiDumo/SuccinctZKResidencyInvite@v3";

export function setupEmailValidator(element: HTMLElement) {
  const sdk = zkeSdk();
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

      // Create proof passing email content
      const proof = await prover.generateProof(emailContent);

      console.log("Got proof: ", proof);

      const verification = await blueprint.verifyProofOnChain(proof);

      console.log("Proof was verified: ", verification);
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

      // Create proof passing email content
      const proof = await prover.generateProof(emailContent);

      console.log("Got proof: ", proof);

      const verification = await blueprint.verifyProofOnChain(proof);

      console.log("Proof was verified: ", verification);
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
