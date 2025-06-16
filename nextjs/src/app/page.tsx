"use client";
import zkeSdk, { Proof } from "@zk-email/sdk";
// To optionally verify if an email is valid first
// import { parseEmail } from "@zk-email/sdk";
import { useState } from "react";
import { initNoirWasm } from "@zk-email/sdk/initNoirWasm";

const blueprintSlug = "DimiDumo/residency_sp1_noir@v2";

export default function Home() {
  const sdk = zkeSdk({ baseUrl: "https://staging-conductor.zk.email" });

  const [fileContent, setFileContent] = useState("");
  const [isLoadingClient, setIsLoadingClient] = useState(false);
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [proof, setProof] = useState<Proof | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // You can optionally verify if an email is valid for a blueprint by parsing it first
    // try {
    //   const parsedEmail = await parseEmail(eml);
    // } catch (err) {
    //   console.error("Email is invalid", err);
    //   throw err;
    // }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
    };
    reader.readAsText(file);
  };

  const handleEmailClient = async () => {
    if (!fileContent) {
      alert("Please provide an email first");
      return;
    }
    setProof(null);
    setIsLoadingClient(true);
    try {
      // Fetch blueprint
      const blueprint = await sdk.getBlueprint(blueprintSlug);

      // Initialize local prover
      const prover = blueprint.createProver({ isLocal: true });
      
      // External inputs are only required if defined in the blueprint
      const externalInputs = [{ name: "eth_address", value: "0x0" }];
      
      // Noir must be initialized seperately
      const noirWasm = await initNoirWasm();
      const options = { noirWasm };

      // Create proof passing email content
      const proof = await prover.generateProof(fileContent, externalInputs, options);

      setProof(proof);

      const verified = await proof.verify(options);

      console.log("Proof was verified client side: ", verified);
      
      console.log("Verifying proof server side");
      // Optional: Verify a proof server side that was created client side
      const response = await fetch('/api/verify-noir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof: proof.packProof()
        })
      });
      
      const result = await response.json();
      console.log("proof verified server side: ", result);
      
    } catch (err) {
      console.error("Could not parse email in frontend: ", err);
    }
    setIsLoadingClient(false);
  };

  const handleEmailServer = async () => {
    if (!fileContent) {
      alert("Please provide an email first");
      return;
    }
    setProof(null);
    setIsLoadingServer(true);
    try {
      // Fetch blueprint
      const blueprint = await sdk.getBlueprint(blueprintSlug);

      // Initialize remote prover
      const prover = blueprint.createProver();
      
      // External inputs are only required if defined in the blueprint
      const externalInputs = [{ name: "eth_address", value: "0x0" }];

      // Create proof passing email content
      const proof = await prover.generateProof(fileContent, externalInputs);

      console.log("Got proof: ", proof);
      setProof(proof);

      const verified = await proof.verify();

      console.log("Proof was verified: ", verified);
      
    } catch (err) {
      console.error("Could not parse email in frontend: ", err);
    }
    setIsLoadingServer(false);
  };

  function formatProofAsStr(proof: Proof) {
    return JSON.stringify(
      {
        proofData: proof.props.proofData,
        publicData: proof.props.publicData,
        externalInputs: proof.props.externalInputs,
        isLocal: proof.props.isLocal,
      },
      null,
      4
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-2xl font-bold">ZK Email SDK Next.js Demo</div>

      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          onChange={handleFileUpload}
          className="block text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
        <div className="flex mt-5">
          <button
            className="mr-5 rounded-full bg-violet-50 text-violet-700 p-4 text-sm font-semibold"
            onClick={handleEmailClient}
            disabled={isLoadingClient}
          >
            {isLoadingClient ? "Proving with Noir..." : "Generate Proof in Browser"}
          </button>
          <button
            className="mr-5 rounded-full bg-violet-50 text-violet-700 p-4 text-sm font-semibold"
            onClick={handleEmailServer}
          >
            {isLoadingServer ? "Loading..." : "Generate Proof Remotely"}
          </button>
        </div>
        {isLoadingClient && (
          <div className="mt-4 text-sm text-gray-600">
            Please wait, this can take up to 5 minutes...
          </div>
        )}
        {proof && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg overflow-auto max-w-2xl">
            <h3 className="font-semibold mb-2">Generated Proof:</h3>
            <pre className="text-sm">{formatProofAsStr(proof)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
