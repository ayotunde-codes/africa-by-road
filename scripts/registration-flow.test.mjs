import { readFileSync } from "node:fs"

const source = readFileSync("app/registration/continue/page.tsx", "utf8")

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

assert(source.includes('value="payment"'), "Payment tab should remain visible in the desktop flow.")
assert(source.includes('activeTab === "payment"'), "Payment section should remain visible in the mobile flow.")
assert(
  source.includes('setActiveTab("social-media")'),
  "Saving personal information should advance users to the Social Media phase."
)
assert(
  !source.includes('disabled={!paymentComplete}'),
  "Social Media should not be disabled until payment is complete."
)
assert(
  !source.includes("paymentComplete && setActiveTab(\"social-media\")"),
  "Social Media navigation should not be gated by payment completion."
)

console.log("Registration flow payment bypass checks passed.")
