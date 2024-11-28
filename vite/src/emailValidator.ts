import { parseEmail } from "@zk-email/sdk";

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

  const validateEmail = async () => {
    try {
      const parsedEmail = await parseEmail(emailContent);
      console.log("parsedEmail: ", parsedEmail);
    } catch (err) {
      console.error("Failed to parse email: ", err);
    }
  }

  // Select the input element specifically and use 'change' event
  const fileInput = element.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }

  const validateButton = element.querySelector('button');
  if (validateButton) {
    validateButton.addEventListener('click', validateEmail);
  }
}
