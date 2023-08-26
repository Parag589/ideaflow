const input = 'another idea &lt;&gt; <span class="highlight"> &lt;&gt; my idea </span> and another &lt;&gt;';

// Define a regular expression pattern to match <span>...</span> tags
const spanPattern = /<span\b[^>]*>.*?<\/span>/g;

// Extract all <span>...</span> tags and store them in an array
const spanTags = [];
const tempInput = input.replace(spanPattern, (match) => {
  spanTags.push(match);
  return "%%SPAN%%";
});

// Replace occurrences of <> with "hello"
const output = tempInput.replace(/&lt;&gt;/g, "hello");

// Put the <span>...</span> tags back in their positions
let index = 0;
const finalOutput = output.replace(/%%SPAN%%/g, () => spanTags[index++]);

console.log(finalOutput);
// && ideaIndex !== i 