# Contributing to LinkedIn Formatter

Thank you for your interest in contributing to LinkedIn Formatter! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and considerate when interacting with other contributors. We aim to maintain a welcoming and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on our GitHub repository with the following information:

1. A clear, descriptive title
2. A detailed description of the bug
3. Steps to reproduce the issue
4. Expected behavior
5. Actual behavior
6. Screenshots (if applicable)
7. Browser and extension version information

### Suggesting Features

We welcome feature suggestions! To suggest a feature:

1. Check existing issues to see if your feature has already been suggested
2. Create a new issue with a clear title and detailed description
3. Explain why this feature would be useful to users
4. Provide examples of how the feature might work

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Test your changes thoroughly
5. Create a pull request with a clear description of the changes

## Development Setup

1. Clone the repository:

    ```
    git clone https://github.com/vinnyab28/linkedin-formatter.git
    ```

2. Navigate to the project directory:

    ```
    cd linkedin-formatter
    ```

3. Install dependencies (if any):

    ```
    npm install
    ```

4. Load the extension in your browser for testing:
    - Chrome: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select the `src` directory
    - Firefox: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select the `manifest.json` file
    - Safari: Follow the Safari-specific instructions in the documentation

## Coding Guidelines

### Code Style

-   Use consistent indentation (2 or 4 spaces)
-   Follow JavaScript best practices
-   Add comments for complex logic
-   Use meaningful variable and function names

### Testing

-   Test your changes on multiple browsers if possible
-   Test with different LinkedIn interface variations
-   Ensure performance isn't negatively impacted

### Documentation

-   Update the README.md if you're adding new features
-   Add JSDoc comments to functions and classes
-   Update VERSION_HISTORY.md with your changes

## Review Process

1. A maintainer will review your pull request
2. Changes may be requested before merging
3. Once approved, your changes will be merged
4. You'll be credited in the VERSION_HISTORY.md file

## Getting Help

If you need help with contributing, please:

-   Create an issue with your question on GitHub
-   Reach out through GitHub Discussions at [github.com/vinnyab28/linkedin-formatter/discussions](https://github.com/vinnyab28/linkedin-formatter/discussions)

Thank you for contributing to LinkedIn Formatter!
