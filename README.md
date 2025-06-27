# LinkedIn Formatter

## Description

LinkedIn Formatter is a browser extension that enhances the LinkedIn post creation experience by adding formatting buttons for bold, italic, and underline text. This extension allows users to easily format their posts while creating content on LinkedIn using Unicode characters, helping their content stand out without violating LinkedIn's formatting restrictions.

## Features

-   **Text Formatting**: Adds formatting buttons to the LinkedIn post editor:

    -   **B** for Bold text
    -   **I** for Italic text
    -   **U** for Underline text
    -   **T** for Clear Formatting (removes all formatting)

-   **Character Counter**: Displays a character counter showing how many characters have been used out of LinkedIn's 3000 character limit

    -   Changes color to orange when approaching the limit (>75%)
    -   Changes color to red when very close to the limit (>90%)
    -   Shows remaining characters when close to the limit

-   **Cross-Browser Compatibility**: Works on Chrome, Firefox, and Safari browsers

## Installation

### From Browser Extension Stores

-   **Chrome**: Install from the [Chrome Web Store](https://chrome.google.com/webstore/detail/linkedin-formatter/your-extension-id)
-   **Firefox**: Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/linkedin-formatter/)
-   **Safari**: Install from the [Mac App Store](https://apps.apple.com/app/linkedin-formatter/id123456789)

### For Development

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/linkedin-formatter.git
    ```
2. Navigate to the project directory:
    ```
    cd linkedin-formatter
    ```
3. Install dependencies (if any):
    ```
    npm install
    ```

## Usage

1. Navigate to LinkedIn feed page (`linkedin.com/feed`).
2. Start creating a new post.
3. Select text you want to format.
4. Click on the formatting button (B, I, U) to apply the desired formatting.
5. Use the "T" (clear formatting) button to remove all formatting from selected text.
6. Monitor your character count with the counter displayed below the editor.

### Formatting Details

-   The extension uses Unicode characters for formatting, not HTML tags
-   Each formatting is applied on a per-character basis
-   Formatting can be combined (text can be both bold and underlined, for example)
-   The character counter updates in real-time with all user interactions

## Privacy Policy

LinkedIn Formatter respects your privacy. The extension:

-   Does NOT collect any personal data
-   Does NOT track your browsing activity
-   Does NOT send any data to external servers
-   Only operates on LinkedIn post editor pages
-   Only modifies the appearance of text within the post editor

## Technical Details

-   Uses Unicode character ranges to transform regular text into bold, italic, and underlined versions
-   Implements a MutationObserver to detect when the LinkedIn post editor is loaded
-   All text transformations happen locally in your browser
-   No external dependencies are required

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:

-   Open an issue on GitHub: [github.com/vinnyab28/linkedin-formatter/issues](https://github.com/vinnyab28/linkedin-formatter/issues)
