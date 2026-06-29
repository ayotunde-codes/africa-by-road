import { existsSync, readFileSync } from "node:fs"

const dashboardSource = readFileSync("app/dashboard/page.tsx", "utf8")
const assessmentPagePath = "app/registration/assessment/page.tsx"

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const assessmentRouteMatches = dashboardSource.match(/href="\/registration\/assessment"/g) ?? []

assert(
  assessmentRouteMatches.length >= 2,
  "Both dashboard Start Assessment buttons should link to the demo assessment route."
)
assert(existsSync(assessmentPagePath), "The demo assessment page should exist.")

const assessmentSource = readFileSync(assessmentPagePath, "utf8")

assert(
  assessmentSource.includes("Requirements Assessment"),
  "The demo assessment page should show the Requirements Assessment heading."
)
assert(
  assessmentSource.includes("Submit assessment"),
  "The demo assessment page should include a submit action for the demo flow."
)
assert(
  assessmentSource.includes('router.push("/dashboard")'),
  "Submitting the demo assessment should return users to the dashboard."
)

console.log("Assessment demo flow checks passed.")
