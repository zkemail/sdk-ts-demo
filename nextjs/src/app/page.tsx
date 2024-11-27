"use client";
import { parseEmail } from "@zk-email/sdk"
import { useState } from "react";

export default function Home() {

  const [fileContent, setFileContent] = useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!fileContent) return;
    try {
      const parsedEmail = await parseEmail(fileContent);
      console.log("parsedEmail: ", parsedEmail);
    } catch (err) {
      console.error("Could not parse email in frontend: ", err);
    }
  };

  const handleEmailServer = async () => {
    if (!fileContent) return;
    try {
      // Create a FormData object
      const formData = new FormData();

      // Create a Blob from the email string and add it as a File to FormData
      const emailBlob = new Blob([fileContent], { type: 'message/rfc822' });
      formData.append('emlFile', emailBlob, 'email.eml');

      // Send the request to your API route
      const response = await fetch('/api/validateEmail', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from API:", data);

    } catch (err) {
      console.log("failed to validate email: ", err)
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-lg">
        ZK Email SDK Next.js Demo
      </div>

      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
        <div className="flex mt-5">
          <button className="mr-5 rounded-full bg-violet-50 text-violet-700 p-4 text-sm font-semibold" onClick={handleEmailClient}>Validate Client Side</button>
          <button className="mr-5 rounded-full bg-violet-50 text-violet-700 p-4 text-sm font-semibold" onClick={handleEmailServer}>Validate Server Side</button>
        </div>
      </div>
    </div>
  );
}
