const buttonContainerSelector = '.share-creation-state__additional-toolbar';
const editorSelector = '.ql-editor';

// Unicode ranges for formatted text
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
 * Converts a character to a specific style, regardless of its current style
 * @param {string} char - Character to format
 * @param {string} targetStyle - 'normal', 'bold', 'italic', or 'underline'
 * @returns {string} - Formatted character
 */
function formatChar(char, targetStyle) {
    // Special case for underline which uses combining character
    if (targetStyle === 'underline') {
        // Remove any existing underline first
        if (char.length > 1 && char[1] === '\u0332') {
            char = char[0];
        }
        
        // Skip whitespace and don't double-underline
        if (char.trim() === '' || char === '\u0332') {
            return char;
        }
        
        return char + '\u0332';
    }
    
    // For normal, bold, and italic styles
    
    // First determine what kind of character this is (in any style)
    let charType = null;
    let currentStyle = null;
    
    // Check in normal style
    charType = getCharType(char, 'normal');
    if (charType) {
        currentStyle = 'normal';
    }
    
    // Check in bold style
    if (!charType) {
        charType = getCharType(char, 'bold');
        if (charType) {
            currentStyle = 'bold';
        }
    }
    
    // Check in italic style
    if (!charType) {
        charType = getCharType(char, 'italic');
        if (charType) {
            currentStyle = 'italic';
        }
    }
    
    // If we couldn't determine the character type, return unchanged
    if (!charType || !currentStyle) {
        return char;
    }
    
    // Convert from the current style to the target style
    return convertChar(char, currentStyle, targetStyle);
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
 * Main function to apply formatting to text
 * @param {string} text - Text to format
 * @param {string} style - 'normal', 'bold', 'italic', or 'underline'
 * @returns {string} - Formatted text
 */
function formatText(text, style) {
    if (style === 'normal') {
        return normalizeText(text);
    }
    
    if (style === 'underline') {
        // First remove any existing underlines
        let cleaned = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\u0332') continue;
            cleaned += text[i];
        }
        
        // Then add underlines to each character
        return Array.from(cleaned).map(c => 
            c.trim() === '' ? c : c + '\u0332'
        ).join('');
    }
    
    // For bold and italic, convert each character
    return Array.from(text).map(char => formatChar(char, style)).join('');
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
                    const selectedText = range.toString();
                    
                    if (selectedText) {
                        const formatted = formatText(selectedText, style);
                        document.execCommand('insertText', false, formatted);
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