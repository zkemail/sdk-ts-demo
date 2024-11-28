import './style.css'
import { setupEmailValidator } from './emailValidator.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>ZK Email Vite Test</h1>
    <div id="email-validator">
      <input
        type="file"
      />
      <div className="flex mt-5">
        <button class="validate-client-side">Validate Client Side</button>
      </div>
    </div>
  </div>
`

setupEmailValidator(document.querySelector<HTMLElement>('#email-validator')!)
