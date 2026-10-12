# Examples Are Not Production Data

Examples deliberately contain placeholders and a `contentStatus` of `DEMO_ONLY_NOT_APPROVED`. They are valid fixtures for schema validation and layout development, but they must **never** be deployed without real approved content and genuine image assets. A production build must reject `DEMO_ONLY_NOT_APPROVED` and missing required contacts or legal/claims fields. `https://example.invalid` is intentionally not a real website.
