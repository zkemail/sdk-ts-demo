import "./style.css";
import { setupEmailValidator } from "./emailValidator.ts";
import { Buffer } from "buffer/";

(window as any).Buffer = Buffer;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>ZK Email Vite Test</h1>
    <div id="email-validator">
      <input
        type="file"
      />
      <div className="flex mt-5">
        <button class="proof-client-side">Generate Proof in Browser</button>
        <button class="proof-server-side">Generate Proof Remotely</button>
      </div>
    </div>
  </div>
`;

setupEmailValidator(document.querySelector<HTMLElement>("#email-validator")!);
