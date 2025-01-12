# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-13

### Added

- Quiz Worksheet management page (#3)
- Book filter: "without attributes" [e40ca37]
- New API v2 with consistent API Responses (#6) [b4156a7]

### Changed

- Added content type, `content | quiz`, default to `content` for external content by URL linking [e843e34]
- Add consistent page title metadata [c650055]
- Update some supabase related script to consistently use `pnpm` [5d45922]
- Use `Promise.all` to reduce sequential blocking (#9) [0d6ee71]

### Fixed

- Fixed inconsistent navigation and routing (#4) [035d19b, 035d19b]
- Fix book and content filtering (#4) [035d19b]


## [0.1.0] - 2024-09-13

### Added

- Initial setup of the project.
- Initial Features: 
  - Collection Management,
  - Attributes management,
  - In-app promotion banner,
  - User management
- Introduce Supabase as BaaS
