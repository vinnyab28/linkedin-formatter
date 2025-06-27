# Version History

This document tracks all notable changes to the LinkedIn Formatter extension across versions.

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
