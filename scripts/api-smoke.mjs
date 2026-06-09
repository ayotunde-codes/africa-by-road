const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://africa-by-road-1.onrender.com"

const checks = [
  {
    name: "payment gateway options",
    path: "/api/public/payment-gateway-options?country=Nigeria",
    expected: [200],
  },
  {
    name: "giveaway winners",
    path: "/api/giveaway/winners",
    expected: [200],
  },
  {
    name: "payment public key",
    path: "/api/payments/key",
    expected: [200],
  },
  {
    name: "invalid login error",
    path: "/api/auth/login",
    expected: [401],
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid@example.com", password: "wrong-password" }),
    },
  },
]

let failures = 0

for (const check of checks) {
  const response = await fetch(`${baseUrl}${check.path}`, check.init)
  const body = await response.text()
  const ok = check.expected.includes(response.status)

  console.log(`${ok ? "PASS" : "FAIL"} ${check.name}: HTTP ${response.status}`)

  if (!ok) {
    failures += 1
    console.log(body.slice(0, 500))
  }
}

if (failures > 0) {
  process.exit(1)
}
