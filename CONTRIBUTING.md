# Contributing to bo-register-index

Thank you for helping improve this dataset. This guide explains how to add a new country or update an existing entry.

---

## What We Need

### High priority additions (v1.1 target)
Italy, Spain, Belgium, Sweden, Malaysia, South Korea, New Zealand, Saudi Arabia, Qatar, Bahrain, Nigeria, Kenya, Mexico, Argentina, Bermuda, Guernsey, Isle of Man, Seychelles, Marshall Islands, Indonesia, Philippines, Thailand, Kuwait, Egypt, Jordan

### Always welcome
- Status updates (register launched, access changed, law amended)
- Quality note improvements (more nuance, new loopholes identified, grey-listing changes)
- Dead URL fixes
- MER updates (new MER published for a jurisdiction)

---

## Before You Start

1. **Check existing entries.** Your country may already be in `data/registers.json`.
2. **Read the schema.** All field definitions are in [`data/schema.md`](data/schema.md). Understand every field before writing.
3. **Use primary sources.** Quality notes must be based on official documents (MERs, legislation, government sites) — not Wikipedia or news articles.

---

## How to Add a New Country

### Step 1 — Fork the repo
Click **Fork** on GitHub. Clone your fork locally.

### Step 2 — Add your entry to `registers.json`

Open `data/registers.json`. Add your entry inside the `registers` array. Order alphabetically by `country` name.

Use this template:

```json
{
  "country": "COUNTRY NAME",
  "iso_code": "XX",
  "fatf_member": true,
  "fatf_region": "FATF",
  "fsrb": null,
  "register_name": "Official Register Name",
  "register_status": "public",
  "access_type": "free",
  "public_search_available": true,
  "api_available": false,
  "api_url": null,
  "entity_types_covered": ["companies"],
  "trusts_covered": false,
  "trust_register_note": "Describe trust situation.",
  "uo_threshold_percent": 25,
  "direct_url": "https://...",
  "legislation": "Act Name, Year",
  "implementation_date": "YYYY-MM-DD",
  "last_policy_update": "YYYY-MM-DD",
  "fatf_r24_rating": "largely_compliant",
  "fatf_mer_year": 2022,
  "fatf_mer_url": "https://www.fatf-gafi.org/...",
  "eu_member": false,
  "eu_amld_applicable": false,
  "data_quality_score": 3,
  "quality_notes": "Write at least 3 sentences here. Explain the practical reality of accessing this register. Note any known gaps, loopholes, nominee risks, or enforcement issues.",
  "last_verified": "YYYY-MM",
  "data_contributor": "your-github-username"
}
```

### Step 3 — Update `meta.total_countries`

Increment the count in the `meta` block at the top of `registers.json`.

### Step 4 — Add a changelog entry

Open `data/changelog.md`. Add a line under `## Upcoming` or create a new patch version entry:

```
## [patch] — YYYY-MM
### Added
- [XX] New entry: Country Name
```

### Step 5 — Validate your JSON

Run the validator locally:

```bash
node validate.js
```

Fix any errors it reports before submitting.

### Step 6 — Submit a Pull Request

Push your branch and open a PR with:
- **Title:** `[ADD] Country Name — ISO_CODE`
- **Description:** Brief note on your sources for this entry

---

## How to Update an Existing Entry

### For a status change (e.g. register went public):

1. Update the relevant fields (`register_status`, `access_type`, `public_search_available`, etc.)
2. Update `last_verified` to the current month (`YYYY-MM`)
3. Update `data_contributor` to your GitHub username
4. Add context to `quality_notes` — don't delete prior notes, append with a date prefix:
   > `[2025-06 update] Register opened to public access following amendment to XYZ Act...`
5. Add changelog entry

### PR Title format for updates:
`[UPDATE] Country Name — what changed`

---

## Quality Standards

### Required for every entry
- All required fields populated (see schema.md)
- `quality_notes` minimum 3 sentences
- `direct_url` is live and leads to the actual register (test it)
- `fatf_r24_rating` matches the most recent available MER
- `last_verified` is the current month

### What makes a great quality_notes entry
- Explains the practical experience of accessing the register (is it easy? slow? broken?)
- Mentions known loopholes (nominee structures, trust gaps, exemptions)
- Notes any grey-listing history and what remediation was done
- References the key legislation
- Explains relevant enforcement or data quality context

### What we will reject
- Entries without a primary source
- Quality notes copied verbatim from government websites
- Entries where required fields are left as `null` without explanation
- JSON with syntax errors

---

## Validator

The `validate.js` script checks:
- Valid JSON syntax
- All required fields present
- `register_status` is a valid enum value
- `fatf_r24_rating` is a valid enum value
- `iso_code` is 2 uppercase letters
- `uo_threshold_percent` is a number between 1 and 100
- `data_quality_score` is between 1 and 5
- `last_verified` matches `YYYY-MM` format

Run before every PR:
```bash
node validate.js
```

---

## Code of Conduct

This is a professional compliance dataset. Contributions must be:
- **Accurate** — based on verifiable primary sources
- **Neutral** — factual, not political
- **Useful** — written for compliance analysts and investigators

---

*Questions? Open an issue. Maintainer: vikas-aml*
