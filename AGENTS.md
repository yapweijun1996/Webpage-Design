# Repository Contracts

## Project scope

This repository collects research-informed website design demos for different companies and industries. The project workflow and completion criteria live in [README.md](README.md).

## Ownership

- Each company owns one directory at `companies/<company-slug>/`. Use lowercase, hyphen-separated slugs.
- Keep that company's research, design brief, implementation, and assets inside its directory.
- A comparison case may contain independent implementation folders under the same company. Each folder owns its code and evidence; the comparison directory owns the experiment protocol and frozen input manifest. Follow those boundaries when working on an implementation.
- `templates/company/` owns the reusable starting structure. An existing company is a separate case study, not a live copy of the template.
- Each company README owns its metadata, progress status, and preview instructions. `companies/README.md` is a derived navigation catalog; synchronize its entry when those fields change.
- Avoid runtime imports between company demos. Shared implementation requires a demonstrated need across existing demos.

## Research and design

- Record source URLs and access dates for company and industry facts. Distinguish verified findings, design inferences, assumptions, and fictional demo content.
- Ground the design brief in the company's research and the intended audience.
- Apply consistent research and quality criteria while allowing different visual styles and page structures across industries.
- Record the provenance of external assets in the company demo's asset notes.

## Delivery

- Document the actual preview commands and entry point for each demo.
- Use the quality criteria in the root README before marking a company `ready`.
- Add catalog links only when their target files or preview destinations exist. Show unavailable work as pending.
- Keep project documentation aligned with observable files and verification results.
