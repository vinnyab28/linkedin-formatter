# Version History

This document tracks all notable changes to the LinkedIn Formatter extension across versions.

## Version 1.1.0 - August 15, 2025

### Bug Fixes
- **Fixed newline preservation**: Multi-line selections now maintain line breaks when formatting is applied
- **Fixed text combination issue**: Selected text spanning multiple lines no longer gets combined into a single line

### New Features
- **Toggle functionality**: Formatting buttons now intelligently toggle formatting on/off
  - If text is already bold, clicking Bold will remove bold formatting
  - If text is already italic, clicking Italic will remove italic formatting
  - If text is already underlined, clicking Underline will remove underline formatting
- **Smart formatting detection**: Extension analyzes selected text and applies/removes formatting based on majority formatting state
- **Mixed formatting support**: Better handling of text with multiple formatting types
- **Improved character analysis**: More accurate detection of existing formatting in selected text

### Technical Improvements
- Completely rewritten formatting engine for better reliability
- Improved Unicode character handling and detection
- Better preservation of whitespace and special characters
- More sophisticated selection handling that preserves original formatting context
- Reduced toggle threshold to 30% for more responsive user experience

### Known Limitations
- Unicode Mathematical Alphanumeric Symbols don't support combined bold+italic formatting
- When both bold and italic are requested, bold takes priority over italic

## Version 1.0.0 (Initial Release) - June 26, 2025

### Features

-   Added formatting buttons to LinkedIn post editor:
    -   Bold (B)
    -   Italic (I)
    -   Underline (U)
    -   Clear Formatting (T)
-   Implemented Unicode-based text formatting for compatibility with LinkedIn
-   Added character counter showing current character count and limit (3000)
-   Added color-coded feedback in character counter (orange at 75%, red at 90%)
-   Added support for all major browsers (Chrome, Firefox, Safari)

### Technical

-   Used MutationObserver to detect when the LinkedIn post editor loads
-   Implemented event listeners for real-time character count updates
-   Created Unicode range-based conversion system for text formatting

## Future Plans

### Planned for Version 1.1.0

-   Add keyboard shortcuts for formatting (Ctrl+B, Ctrl+I, Ctrl+U)
-   Improve support for non-Latin character sets
-   Add formatting persistence between editing sessions
-   Optimize performance for large posts

### Planned for Version 1.2.0

-   Add additional formatting options (strikethrough, superscript, subscript)
-   Add custom theme options
-   Add support for formatting in LinkedIn message composer
-   Improve accessibility features
