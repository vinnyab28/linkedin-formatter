const buttonContainerSelector = '.share-creation-state__additional-toolbar';
const editorSelector = '.ql-editor';

// Unicode ranges for formatted text
// Note: Unicode Mathematical Alphanumeric Symbols don't support combined bold+italic
// So when both are requested, bold takes priority over italic
const UNICODE_RANGES = {
    // Normal ranges
    normal: {
        lowercase: [0x0061, 0x007A], // a-z
        uppercase: [0x0041, 0x005A], // A-Z
        numbers: [0x0030, 0x0039]    // 0-9
    },
    // Bold text ranges
    bold: {
        lowercase: [0x1D5EE, 0x1D607], // 𝗮-𝘇
        uppercase: [0x1D5D4, 0x1D5ED], // 𝗔-𝗭
        numbers: [0x1D7EC, 0x1D7F5]    // 𝟬-𝟵
    },
    // Italic text ranges
    italic: {
        lowercase: [0x1D622, 0x1D63B], // 𝘢-𝘻
        uppercase: [0x1D608, 0x1D621], // 𝘈-𝘡
        numbers: [0x1D7E2, 0x1D7EB]    // 𝟢-𝟫
    }
};

/**
 * Determines if a character is within a specific Unicode range
 * @param {string} char - The character to check
 * @param {number[]} range - The Unicode range [start, end]
 * @returns {boolean} - Whether the character is in the range
 */
function isInRange(char, range) {
    const codePoint = char.codePointAt(0);
    return codePoint >= range[0] && codePoint <= range[1];
}

/**
 * Gets the character type (lowercase, uppercase, number)
 * @param {string} char - The character to check
 * @param {string} style - The style to check against ('normal', 'bold', 'italic')
 * @returns {string|null} - The character type or null if not found
 */
function getCharType(char, style) {
    const ranges = UNICODE_RANGES[style];
    
    if (isInRange(char, ranges.lowercase)) return 'lowercase';
    if (isInRange(char, ranges.uppercase)) return 'uppercase';
    if (isInRange(char, ranges.numbers)) return 'numbers';
    
    return null;
}

/**
 * Converts a character from one style to another
 * @param {string} char - The character to convert
 * @param {string} fromStyle - The current style ('normal', 'bold', 'italic')
 * @param {string} toStyle - The target style ('normal', 'bold', 'italic')
 * @returns {string} - The converted character or original if conversion not possible
 */
function convertChar(char, fromStyle, toStyle) {
    // If styles are the same, no conversion needed
    if (fromStyle === toStyle) return char;
    
    // Get the character type within the current style
    const charType = getCharType(char, fromStyle);
    if (!charType) return char; // Not a convertible character
    
    // Get the code point and relative position within its range
    const codePoint = char.codePointAt(0);
    const rangeStart = UNICODE_RANGES[fromStyle][charType][0];
    const relativePos = codePoint - rangeStart;
    
    // Calculate the code point in the target style
    const targetRangeStart = UNICODE_RANGES[toStyle][charType][0];
    const targetCodePoint = targetRangeStart + relativePos;
    
    // Convert to character and return
    return String.fromCodePoint(targetCodePoint);
}

/**
 * Gets the selected text while preserving all Unicode formatting and newlines
 * @param {Range} range - The selection range
 * @returns {string} - The selected text with original formatting preserved
 */
function getSelectedTextWithFormatting(range) {
    if (!range || range.collapsed) return '';
    
    // Create a temporary container to extract the content
    const container = document.createElement('div');
    container.appendChild(range.cloneContents());
    
    // Extract text content which preserves Unicode characters and newlines
    return container.textContent || container.innerText || '';
}

/**
 * Detects the current formatting state of a character
 * @param {string} char - Character to analyze (may include underline combining char)
 * @returns {Object} - Object with bold, italic, underline boolean properties
 */
function detectCharacterFormatting(char) {
    const formatting = { bold: false, italic: false, underline: false, normal: false };
    
    // Check for underline (combining character)
    if (char.length > 1 && char.includes('\u0332')) {
        formatting.underline = true;
        // Remove underline to check base character
        char = char.replace(/\u0332/g, '');
    }
    
    if (char.length === 0) return formatting;
    
    const baseChar = char[0];
    
    // Check if it's in bold range
    const boldType = getCharType(baseChar, 'bold');
    if (boldType) {
        formatting.bold = true;
        return formatting;
    }
    
    // Check if it's in italic range
    const italicType = getCharType(baseChar, 'italic');
    if (italicType) {
        formatting.italic = true;
        return formatting;
    }
    
    // Check if it's normal text
    const normalType = getCharType(baseChar, 'normal');
    if (normalType) {
        formatting.normal = true;
    }
    
    return formatting;
}

/**
 * Analyzes the formatting state of the entire selected text
 * @param {string} text - Text to analyze
 * @returns {Object} - Object with percentages of each formatting type
 */
function analyzeTextFormatting(text) {
    if (!text) return { bold: 0, italic: 0, underline: 0, normal: 100 };
    
    const chars = Array.from(text);
    let totalChars = 0;
    let boldChars = 0;
    let italicChars = 0;
    let underlineChars = 0;
    let normalChars = 0;
    
    let i = 0;
    while (i < chars.length) {
        let char = chars[i];
        
        // Check if next character is underline combining character
        if (i + 1 < chars.length && chars[i + 1] === '\u0332') {
            char += chars[i + 1];
            i++; // Skip the combining character in next iteration
        }
        
        // Skip pure whitespace and newlines for formatting analysis
        if (char.trim() === '' || char === '\n' || char === '\r') {
            i++;
            continue;
        }
        
        const formatting = detectCharacterFormatting(char);
        totalChars++;
        
        if (formatting.bold) boldChars++;
        if (formatting.italic) italicChars++;
        if (formatting.underline) underlineChars++;
        if (formatting.normal) normalChars++;
        
        i++;
    }
    
    if (totalChars === 0) return { bold: 0, italic: 0, underline: 0, normal: 100 };
    
    return {
        bold: (boldChars / totalChars) * 100,
        italic: (italicChars / totalChars) * 100,
        underline: (underlineChars / totalChars) * 100,
        normal: (normalChars / totalChars) * 100
    };
}

/**
 * Applies or removes a specific formatting to/from a character
 * @param {string} char - Character to format (may include underline)
 * @param {string} formatType - 'bold', 'italic', 'underline'
 * @param {boolean} shouldApply - Whether to apply (true) or remove (false) the formatting
 * @returns {string} - Formatted character
 */
function toggleCharacterFormatting(char, formatType, shouldApply) {
    if (!char || char.trim() === '') return char;
    
    let baseChar = char;
    let hasUnderline = false;
    
    // Handle underline combining character
    if (char.includes('\u0332')) {
        hasUnderline = true;
        baseChar = char.replace(/\u0332/g, '');
    }
    
    if (baseChar.length === 0) return char;
    
    // Determine current base format
    const currentFormatting = detectCharacterFormatting(baseChar);
    let resultChar = baseChar[0];
    
    // Start with the base character in normal form
    if (currentFormatting.bold) {
        resultChar = convertChar(baseChar[0], 'bold', 'normal');
    } else if (currentFormatting.italic) {
        resultChar = convertChar(baseChar[0], 'italic', 'normal');
    }
    
    // Now determine what the final formatting should be
    let shouldBeBold = currentFormatting.bold;
    let shouldBeItalic = currentFormatting.italic;
    
    // Apply the toggle logic
    if (formatType === 'bold') {
        shouldBeBold = shouldApply;
    } else if (formatType === 'italic') {
        shouldBeItalic = shouldApply;
    }
    
    // Handle underline separately
    if (formatType === 'underline') {
        hasUnderline = shouldApply;
    }
    
    // Apply the final formatting
    // Note: We can't have both bold and italic in Unicode mathematical symbols
    // So we prioritize bold over italic if both are requested
    if (shouldBeBold) {
        resultChar = convertChar(resultChar, 'normal', 'bold');
    } else if (shouldBeItalic) {
        resultChar = convertChar(resultChar, 'normal', 'italic');
    }
    
    // Add underline back if needed
    if (hasUnderline && resultChar.trim() !== '') {
        resultChar += '\u0332';
    }
    
    return resultChar;
}

/**
 * Advanced formatting function that handles toggle logic
 * @param {string} text - Text to format
 * @param {string} formatType - 'bold', 'italic', 'underline', or 'normal'
 * @returns {string} - Formatted text with preserved newlines and spaces
 */
function formatTextAdvanced(text, formatType) {
    if (!text) return text;
    
    if (formatType === 'normal') {
        return normalizeText(text);
    }
    
    // Analyze current formatting to determine if we should apply or remove
    const analysis = analyzeTextFormatting(text);
    
    // Determine if we should apply or remove the formatting
    // If more than 30% of text already has this formatting, remove it; otherwise apply it
    // Using 30% threshold to be more responsive to user intent
    let shouldApply = true;
    if (formatType === 'bold' && analysis.bold > 30) shouldApply = false;
    if (formatType === 'italic' && analysis.italic > 30) shouldApply = false;
    if (formatType === 'underline' && analysis.underline > 30) shouldApply = false;
    
    // Process each character while preserving structure
    const chars = Array.from(text);
    let result = '';
    let i = 0;
    
    while (i < chars.length) {
        let char = chars[i];
        
        // Check if next character is underline combining character
        if (i + 1 < chars.length && chars[i + 1] === '\u0332') {
            char += chars[i + 1];
            i++; // Skip the combining character in next iteration
        }
        
        // Preserve newlines and whitespace
        if (char === '\n' || char === '\r' || char.trim() === '') {
            result += char;
        } else {
            result += toggleCharacterFormatting(char, formatType, shouldApply);
        }
        
        i++;
    }
    
    return result;
}

/**
 * Removes any formatting from text (bold, italic, underline)
 * @param {string} text - Text to normalize
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
    let result = '';
    let i = 0;
    
    // First, handle and remove any underlines
    while (i < text.length) {
        const char = text[i];
        
        // Skip standalone underline characters
        if (char === '\u0332') {
            i++;
            continue;
        }
        
        // Skip the underline part if present
        if (i + 1 < text.length && text[i + 1] === '\u0332') {
            result += char;
            i += 2;
        } else {
            result += char;
            i++;
        }
    }
    
    // Now, convert any bold or italic characters to normal
    return Array.from(result).map(char => {
        // Try to detect if it's bold
        let charType = getCharType(char, 'bold');
        if (charType) {
            return convertChar(char, 'bold', 'normal');
        }
        
        // Try to detect if it's italic
        charType = getCharType(char, 'italic');
        if (charType) {
            return convertChar(char, 'italic', 'normal');
        }
        
        // Already normal
        return char;
    }).join('');
}

/**
 * Main function to apply formatting to text (updated to use advanced formatting)
 * @param {string} text - Text to format
 * @param {string} style - 'normal', 'bold', 'italic', or 'underline'
 * @returns {string} - Formatted text
 */
function formatText(text, style) {
    return formatTextAdvanced(text, style);
}

/**
 * Creates a formatting button
 * @param {string} label - Button label ('B', 'I', 'U', 'N')
 * @param {string} style - 'bold', 'italic', 'underline', or 'normal'
 * @returns {HTMLElement} - Button element
 */
function createButton(label, style) {
    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.classList.add('linkedin-formatter-button');
    
    // Create span for the button
    const span = document.createElement('span');
    span.tabIndex = -1;
    span.className = 'artdeco-hoverable-trigger artdeco-hoverable-trigger--content-placed-top ember-view';
    
    // Create the button element
    const button = document.createElement('button');
    let title;
    
    if (style === 'normal') {
        title = 'Clear Formatting';
    } else {
        title = style.charAt(0).toUpperCase() + style.slice(1);
    }
    
    button.title = title;
    button.setAttribute('aria-label', title);
    button.className = 'artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view';
    button.type = 'button';
    
    // Create icon span
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    
    // Apply appropriate styling
    if (style === 'bold') {
        icon.style.fontWeight = 'bold';
    } else if (style === 'italic') {
        icon.style.fontStyle = 'italic';
    } else if (style === 'underline') {
        icon.style.textDecoration = 'underline';
    } else if (style === 'normal') {
        // For clear formatting button, use a special style to represent clearing formatting
        icon.style.textDecoration = 'line-through';
        icon.style.fontFamily = 'monospace';
        icon.style.fontSize = '10px';
    }
    
    icon.textContent = label;
    button.appendChild(icon);
    
    // Create screen reader text
    const srText = document.createElement('span');
    srText.className = 'artdeco-button__text';
    srText.textContent = title;
    button.appendChild(srText);
    
    // Add click event handler
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const editor = document.querySelector(editorSelector);
        
        if (editor) {
            const selection = window.getSelection();
            
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                
                if (editor.contains(range.commonAncestorContainer)) {
                    // Get the selected content with formatting preserved
                    const selectedContent = getSelectedTextWithFormatting(range);
                    
                    if (selectedContent) {
                        const formatted = formatText(selectedContent, style);
                        
                        // Delete the selected content and insert the formatted version
                        range.deleteContents();
                        
                        // Create a document fragment to insert the formatted text
                        const fragment = document.createDocumentFragment();
                        const textNode = document.createTextNode(formatted);
                        fragment.appendChild(textNode);
                        
                        range.insertNode(fragment);
                        
                        // Update character count
                        updateCharacterCount();
                        
                        // Restore selection to the end of inserted content
                        range.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        }
    });
    
    // Assemble the components
    span.appendChild(button);
    wrapper.appendChild(span);
    
    // Add hover content div
    const hoverContent = document.createElement('div');
    hoverContent.className = 'ember-view';
    wrapper.appendChild(hoverContent);
    
    return wrapper;
}

/**
 * Updates the character count display
 */
function updateCharacterCount() {
    const editor = document.querySelector(editorSelector);
    if (!editor) return;
    
    // Get the text content of the editor
    const text = editor.textContent || '';
    
    // Calculate character count (handling Unicode properly)
    const charCount = Array.from(text).length;
    
    // Find or create the character counter element
    let counterElement = document.querySelector('.linkedin-formatter-char-count');
    
    if (!counterElement) {
        // Create counter element if it doesn't exist
        counterElement = document.createElement('div');
        counterElement.className = 'linkedin-formatter-char-count';
        counterElement.style.fontSize = '12px';
        counterElement.style.color = '#666';
        counterElement.style.textAlign = 'right';
        counterElement.style.padding = '4px 16px';
        counterElement.style.marginTop = '4px';
        counterElement.style.fontWeight = 'bold';
        counterElement.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
        
        // Find the appropriate place to insert the counter
        const parentContainer = document.querySelector('.share-creation-state__container');
        if (parentContainer) {
            parentContainer.appendChild(counterElement);
        } else {
            // Fallback - append after the editor
            const editorParent = editor.parentElement;
            if (editorParent && editorParent.parentElement) {
                editorParent.parentElement.appendChild(counterElement);
            }
        }
    }
    
    // Update the counter text and styling
    const limit = 3000;
    const remaining = limit - charCount;
    const percentage = (charCount / limit) * 100;
    
    // Change color based on how close to the limit
    let color = '#666'; // Default gray
    
    if (percentage > 90) {
        color = '#d11124'; // Red when very close to limit
    } else if (percentage > 75) {
        color = '#e98f00'; // Orange when getting closer
    }
    
    counterElement.style.color = color;
    
    // Display different text based on how close to the limit
    if (percentage > 90) {
        counterElement.textContent = `${remaining} characters remaining`;
    } else {
        counterElement.textContent = `${charCount}/${limit} characters`;
    }
}

/**
 * Injects formatting buttons into the LinkedIn post editor
 */
function injectButtons() {
    const buttonContainer = document.querySelector(buttonContainerSelector);
    
    if (buttonContainer && !buttonContainer.querySelector('.linkedin-formatter-button')) {
        buttonContainer.appendChild(createButton('B', 'bold'));
        buttonContainer.appendChild(createButton('I', 'italic'));
        buttonContainer.appendChild(createButton('U', 'underline'));
        buttonContainer.appendChild(createButton('T', 'normal')); // 'T' for Text (normal text)
        
        // Set up character counter
        updateCharacterCount();
        
        // Add event listeners to update character count
        const editor = document.querySelector(editorSelector);
        if (editor) {
            // The 'input' event covers all user interactions that modify content
            // including typing, pasting, deleting, and other edits
            editor.addEventListener('input', updateCharacterCount);
            
            // Keep 'change' for safety (fires when content changes and element loses focus)
            editor.addEventListener('change', updateCharacterCount);
            
            // Clipboard events with slight delay to ensure content is updated
            editor.addEventListener('paste', () => setTimeout(updateCharacterCount, 10));
            editor.addEventListener('cut', () => setTimeout(updateCharacterCount, 10));
            
            // Focus events to update when returning to the editor
            editor.addEventListener('focus', updateCharacterCount);
            editor.addEventListener('blur', updateCharacterCount);
            
            // Click to catch selection changes or focus
            editor.addEventListener('click', updateCharacterCount);
            
            // Also set an interval to periodically check, in case other methods modify the content
            setInterval(updateCharacterCount, 1000);
        }
    }
}

// Set up mutation observer to watch for the editor's appearance
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            injectButtons();
        }
    }
});

// Start observing the document
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial attempt to inject buttons
injectButtons();