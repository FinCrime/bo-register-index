# bo-register-index

> A structured, analyst-maintained index of beneficial ownership registers across FATF jurisdictions.
> Built for AML compliance, KYB, and financial crime investigation teams.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Countries](https://img.shields.io/badge/Countries-20-green.svg)](#coverage)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-April%202025-orange.svg)](#)

---

## What Is This?

When conducting KYB (Know Your Business), AML investigations, or vendor due diligence, one of the first questions an analyst must answer is:

> **"Can I independently verify the beneficial owners of this entity in its jurisdiction of incorporation?"**

The answer depends entirely on whether that jurisdiction has a beneficial ownership register — and if so, whether it is public, restricted, or effectively inaccessible.

This project maintains a structured, machine-readable database of beneficial ownership register status for **20+ jurisdictions** (expanding to 45+), covering:

- Whether a register exists and its operational status
- Whether public access is available (and free)
- Whether an API exists for automated querying
- The UBO ownership threshold used
- FATF Recommendation 24 compliance rating from the latest MER
- Analyst-written notes on practical access, known gaps, and enforcement context

---

## Why Now?

FATF revised **Recommendation 24** in October 2022 — the most significant update to beneficial ownership standards in a decade. It requires all member jurisdictions to maintain accurate, up-to-date BO information and pushed strongly toward public registers.

Implementation is uneven. As of 2025:
- Some jurisdictions have live, free, API-enabled public registers (UK, Canada)
- Some passed legislation but have not launched the register (South Africa, Australia)
- Some have registers restricted to law enforcement only (Singapore, UAE, USA)
- Some have effectively no register and no active commitment (Switzerland, Japan)

Compliance teams track this manually. No clean, open-source, structured tracker exists.
**This project fills that gap.**

---

## Quick Stats

| Metric | Count |
|---|---|
| Total jurisdictions | 20 (v1.0) |
| Public registers | 3 (UK, Canada, Brazil) |
| Government-only access | 5 |
| Restricted access | 5 |
| No register | 4 |
| With API | 4 |
| FATF direct members | 14 |

---

## Coverage

### v1.0 — 20 Countries

| Region | Countries |
|---|---|
| FATF Core | UK 🇬🇧, USA 🇺🇸, Germany 🇩🇪, France 🇫🇷, Netherlands 🇳🇱, Canada 🇨🇦, Australia 🇦🇺, Singapore 🇸🇬 |
| APAC | India 🇮🇳, Hong Kong 🇭🇰 |
| Offshore / High-Risk | Cayman Islands 🇰🇾, BVI 🇻🇬, Panama 🇵🇦, Jersey 🇯🇪, Mauritius 🇲🇺 |
| Other FATF | Switzerland 🇨🇭, Japan 🇯🇵, South Africa 🇿🇦, Brazil 🇧🇷 |
| Other | UAE 🇦🇪 |

### Planned — v1.1 (45 Countries)
Italy, Spain, Belgium, Sweden, Malaysia, South Korea, New Zealand, Saudi Arabia, Qatar, Bahrain, Nigeria, Kenya, Mexico, Argentina, Bermuda, Guernsey, Isle of Man, Seychelles, Marshall Islands, and more.

---

## How to Use

### Browse the Data

Visit the live site: **[FinCrime.github.io/bo-register-index](https://FinCrime.github.io/bo-register-index)**

### Use the JSON Directly

The dataset lives in `data/registers.json`. You can:

**Fetch in JavaScript:**
```javascript
const response = await fetch('https://raw.githubusercontent.com/FinCrime-aml/bo-register-index/main/data/registers.json');
const data = await response.json();
const registers = data.registers;

// Find all public registers
const publicRegisters = registers.filter(r => r.register_status === 'public');

// Look up a specific country by ISO code
const uk = registers.find(r => r.iso_code === 'GB');

// Get all jurisdictions with APIs
const withApi = registers.filter(r => r.api_available === true);
```

**Fetch in Python:**
```python
import requests

url = "https://raw.githubusercontent.com/fincrime/bo-register-index/main/data/registers.json"
data = requests.get(url).json()
registers = data["registers"]

# All non-compliant jurisdictions
non_compliant = [r for r in registers if r["fatf_r24_rating"] == "non_compliant"]

# Jurisdictions with no BO register
no_register = [r for r in registers if r["register_status"] == "none"]
```

---

## Data Schema

Full schema documentation: [`data/schema.md`](data/schema.md)

Key fields per entry:

| Field | Description |
|---|---|
| `register_status` | `public` / `public_paid` / `restricted` / `government_only` / `legislation_only` / `planned` / `none` |
| `access_type` | `free` / `paid` / `restricted` |
| `api_available` | Boolean — whether a structured API exists |
| `uo_threshold_percent` | % ownership that triggers BO disclosure |
| `fatf_r24_rating` | Compliance rating from FATF MER |
| `data_quality_score` | 1–5 analyst quality score |
| `quality_notes` | Analyst narrative on practical access and known gaps |
| `trusts_covered` | Whether trusts are in scope |

---

## Data Sources

All entries are researched from primary sources:

- [FATF Mutual Evaluation Reports](https://www.fatf-gafi.org/en/publications/Mutualevaluations/)
- [FATF Recommendation 24 (Revised 2022)](https://www.fatf-gafi.org/en/topics/fatf-recommendations.html)
- [EU 6th Anti-Money Laundering Directive (6AMLD)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32018L1673)
- [EGMONT Group Country Profiles](https://egmontgroup.org/members/)
- [CFATF, APG, GAFILAT, ESAAMLG MER repositories](https://www.fatf-gafi.org/en/topics/fatf-style-regional-bodies.html)
- National company registry and government legislation websites

---

## Contributing

We welcome contributions to:
- Add missing countries
- Update existing entries when register status changes
- Correct errors
- Improve quality notes

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting a PR.

---

## License

MIT — see [`LICENSE`](LICENSE)

---

## About the Maintainer

Built and maintained by **Vikas** 

*"The goal is simple: any analyst anywhere should be able to answer 'can I verify beneficial ownership in this jurisdiction?' in under 30 seconds."*

---

*Star ⭐ this repo if you find it useful. Issues and PRs welcome.*
