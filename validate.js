#!/usr/bin/env node

/**
 * bo-register-index — Schema Validator
 * 
 * Validates data/registers.json against the schema defined in data/schema.md
 * Run: node validate.js
 * 
 * Exit code 0 = valid
 * Exit code 1 = validation errors found
 */

const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const DATA_FILE = path.join(__dirname, 'data', 'registers.json');

const VALID_REGISTER_STATUS = [
  'public',
  'public_paid',
  'restricted',
  'government_only',
  'legislation_only',
  'planned',
  'none',
];

const VALID_ACCESS_TYPE = [
  'free',
  'paid',
  'restricted',
];

const VALID_FATF_R24_RATING = [
  'compliant',
  'largely_compliant',
  'partially_compliant',
  'non_compliant',
  'not_yet_evaluated',
];

const REQUIRED_FIELDS = [
  'country',
  'iso_code',
  'fatf_member',
  'fatf_region',
  'fsrb',
  'register_name',
  'register_status',
  'access_type',
  'public_search_available',
  'api_available',
  'entity_types_covered',
  'trusts_covered',
  'trust_register_note',
  'uo_threshold_percent',
  'direct_url',
  'legislation',
  'implementation_date',
  'last_policy_update',
  'fatf_r24_rating',
  'fatf_mer_year',
  'fatf_mer_url',
  'eu_member',
  'eu_amld_applicable',
  'data_quality_score',
  'quality_notes',
  'last_verified',
  'data_contributor',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

let errors = [];
let warnings = [];

function error(country, iso, field, message) {
  errors.push(`  ✗ [${iso || country}] ${field}: ${message}`);
}

function warn(country, iso, field, message) {
  warnings.push(`  ⚠ [${iso || country}] ${field}: ${message}`);
}

// ─── Main Validation ──────────────────────────────────────────────────────────

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  bo-register-index — Schema Validator');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 1. Check file exists
if (!fs.existsSync(DATA_FILE)) {
  console.error('✗ FATAL: data/registers.json not found.');
  process.exit(1);
}

// 2. Parse JSON
let data;
try {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  data = JSON.parse(raw);
  console.log('✓ JSON syntax valid\n');
} catch (e) {
  console.error(`✗ FATAL: JSON parse error — ${e.message}`);
  process.exit(1);
}

// 3. Check top-level structure
if (!data.meta) error('ROOT', '', 'meta', 'Missing top-level meta object');
if (!Array.isArray(data.registers)) {
  console.error('✗ FATAL: registers is not an array');
  process.exit(1);
}

// 4. Check meta
if (data.meta) {
  if (!data.meta.version) error('META', '', 'version', 'Missing version field');
  if (!data.meta.last_updated) error('META', '', 'last_updated', 'Missing last_updated field');
  if (typeof data.meta.total_countries !== 'number') {
    error('META', '', 'total_countries', 'Must be a number');
  } else if (data.meta.total_countries !== data.registers.length) {
    warn('META', '', 'total_countries', 
      `Declared ${data.meta.total_countries} but found ${data.registers.length} entries`
    );
  }
}

console.log(`Validating ${data.registers.length} country entries...\n`);

// 5. Validate each entry
const seenIsoCodes = new Set();

data.registers.forEach((entry, index) => {
  const country = entry.country || `Entry #${index + 1}`;
  const iso = entry.iso_code || '??';

  // Check for duplicate ISO codes
  if (entry.iso_code) {
    if (seenIsoCodes.has(entry.iso_code)) {
      error(country, iso, 'iso_code', `Duplicate ISO code: ${entry.iso_code}`);
    }
    seenIsoCodes.add(entry.iso_code);
  }

  // Check required fields present
  REQUIRED_FIELDS.forEach(field => {
    if (!(field in entry)) {
      error(country, iso, field, 'Required field missing');
    }
  });

  // iso_code: 2 uppercase letters
  if (entry.iso_code !== undefined) {
    if (!/^[A-Z]{2}$/.test(entry.iso_code)) {
      error(country, iso, 'iso_code', `Must be 2 uppercase letters (ISO 3166-1 alpha-2). Got: "${entry.iso_code}"`);
    }
  }

  // register_status: valid enum
  if (entry.register_status !== undefined) {
    if (!VALID_REGISTER_STATUS.includes(entry.register_status)) {
      error(country, iso, 'register_status',
        `Invalid value: "${entry.register_status}". Must be one of: ${VALID_REGISTER_STATUS.join(', ')}`
      );
    }
  }

  // access_type: valid enum
  if (entry.access_type !== undefined) {
    if (!VALID_ACCESS_TYPE.includes(entry.access_type)) {
      error(country, iso, 'access_type',
        `Invalid value: "${entry.access_type}". Must be one of: ${VALID_ACCESS_TYPE.join(', ')}`
      );
    }
  }

  // fatf_r24_rating: valid enum
  if (entry.fatf_r24_rating !== undefined) {
    if (!VALID_FATF_R24_RATING.includes(entry.fatf_r24_rating)) {
      error(country, iso, 'fatf_r24_rating',
        `Invalid value: "${entry.fatf_r24_rating}". Must be one of: ${VALID_FATF_R24_RATING.join(', ')}`
      );
    }
  }

  // uo_threshold_percent: number 1-100
  if (entry.uo_threshold_percent !== undefined) {
    if (typeof entry.uo_threshold_percent !== 'number' ||
        entry.uo_threshold_percent < 1 ||
        entry.uo_threshold_percent > 100) {
      error(country, iso, 'uo_threshold_percent', `Must be a number between 1 and 100. Got: ${entry.uo_threshold_percent}`);
    }
  }

  // data_quality_score: 1-5
  if (entry.data_quality_score !== undefined) {
    if (typeof entry.data_quality_score !== 'number' ||
        entry.data_quality_score < 1 ||
        entry.data_quality_score > 5 ||
        !Number.isInteger(entry.data_quality_score)) {
      error(country, iso, 'data_quality_score', `Must be an integer between 1 and 5. Got: ${entry.data_quality_score}`);
    }
  }

  // last_verified: YYYY-MM format
  if (entry.last_verified !== undefined && entry.last_verified !== null) {
    if (!/^\d{4}-\d{2}$/.test(entry.last_verified)) {
      error(country, iso, 'last_verified', `Must be YYYY-MM format. Got: "${entry.last_verified}"`);
    }
  }

  // implementation_date: YYYY-MM-DD or null
  if (entry.implementation_date !== undefined && entry.implementation_date !== null) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.implementation_date)) {
      error(country, iso, 'implementation_date', `Must be YYYY-MM-DD format or null. Got: "${entry.implementation_date}"`);
    }
  }

  // boolean fields
  ['fatf_member', 'public_search_available', 'api_available', 'trusts_covered', 'eu_member', 'eu_amld_applicable'].forEach(field => {
    if (field in entry && typeof entry[field] !== 'boolean') {
      error(country, iso, field, `Must be boolean (true/false). Got: ${JSON.stringify(entry[field])}`);
    }
  });

  // entity_types_covered: must be an array
  if ('entity_types_covered' in entry && !Array.isArray(entry.entity_types_covered)) {
    error(country, iso, 'entity_types_covered', 'Must be an array (use [] if empty)');
  }

  // quality_notes: minimum length check
  if (entry.quality_notes && typeof entry.quality_notes === 'string') {
    if (entry.quality_notes.length < 100) {
      warn(country, iso, 'quality_notes', `Very short (${entry.quality_notes.length} chars). Aim for at least 200 characters.`);
    }
  }

  // direct_url: basic URL check
  if (entry.direct_url && typeof entry.direct_url === 'string') {
    if (!entry.direct_url.startsWith('http')) {
      warn(country, iso, 'direct_url', `Should be a full URL starting with http. Got: "${entry.direct_url}"`);
    }
  }

  // api_url: if api_available is true, api_url should not be null
  if (entry.api_available === true && !entry.api_url) {
    warn(country, iso, 'api_url', 'api_available is true but api_url is null. Please add the API documentation URL.');
  }

  // data_contributor: should not be empty
  if (entry.data_contributor !== undefined) {
    if (!entry.data_contributor || entry.data_contributor.trim() === '') {
      error(country, iso, 'data_contributor', 'Must be a non-empty GitHub username');
    }
  }
});

// ─── Results ──────────────────────────────────────────────────────────────────

if (warnings.length > 0) {
  console.log(`Warnings (${warnings.length}):\n`);
  warnings.forEach(w => console.log(w));
  console.log('');
}

if (errors.length > 0) {
  console.log(`Errors (${errors.length}):\n`);
  errors.forEach(e => console.log(e));
  console.log(`\n✗ Validation FAILED — ${errors.length} error(s) found. Fix before submitting PR.\n`);
  process.exit(1);
} else {
  console.log(`✓ All ${data.registers.length} entries passed validation.`);
  if (warnings.length > 0) {
    console.log(`  (${warnings.length} warning(s) — review recommended but not blocking)\n`);
  } else {
    console.log('  No warnings.\n');
  }
  console.log('✓ Dataset is valid. Ready to submit.\n');
  process.exit(0);
}
