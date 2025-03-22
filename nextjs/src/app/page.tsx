"use client";
import zkeSdk, { Proof } from "@zk-email/sdk";
import { useState } from "react";

const blueprintSlug = "DimiDumo/SuccinctZKResidencyInvite@v3";

export default function Home() {
  const sdk = zkeSdk();

  const [fileContent, setFileContent] = useState("");
  const [isLoadingClient, setIsLoadingClient] = useState(false);
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [proof, setProof] = useState<Proof | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

      // Create proof passing email content
      const proof = await prover.generateProof(fileContent);

      console.log("Got proof: ", proof);
      setProof(proof);

      const verification = await blueprint.verifyProofOnChain(proof);

      console.log("Proof was verified: ", verification);
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

      // Create proof passing email content
      const proof = await prover.generateProof(fileContent);

      console.log("Got proof: ", proof);
      setProof(proof);

      const verification = await blueprint.verifyProofOnChain(proof);

      console.log("Proof was verified: ", verification);
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
            {isLoadingClient ? "Loading..." : "Generate Proof in Browser"}
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
            Please wait, this can take up to 10 minutes...
          </div>
        )}
        {proof && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg overflow-auto max-w-2xl">
            <pre className="text-sm">{formatProofAsStr(proof)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
