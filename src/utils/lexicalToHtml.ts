// This is a simplified utility to convert Lexical JSON to HTML.
// A full implementation would be more complex, handling various node types (paragraphs, headings, lists, images, etc.)
// and their formatting (bold, italic, links, etc.).

interface LexicalNode {
  type: string;
  format?: number;
  tag?: string;
  url?: string;
  text?: string;
  listType?: 'bullet' | 'number';
  children?: LexicalNode[];
}

export function convertToHtml(lexicalJson: { root: LexicalNode }): string {
  if (!lexicalJson || !lexicalJson.root || !lexicalJson.root.children) {
    return '';
  }

  let html = '';

  lexicalJson.root.children.forEach((node: LexicalNode) => {
    if (node.type === 'paragraph') {
      let paragraphContent = '';
      node.children?.forEach((child: LexicalNode) => {
        if (child.type === 'text') {
          let text = child.text || '';
          if (child.format && (child.format & 1)) text = `<strong>${text}</strong>`; // Bold
          if (child.format && (child.format & 2)) text = `<em>${text}</em>`;     // Italic
          // Add more formatting as needed
          paragraphContent += text;
        } else if (child.type === 'link' && child.url) {
          paragraphContent += `<a href="${child.url}">${child.children?.map((c: LexicalNode) => c.text).join('')}</a>`;
        }
        // Handle other inline node types
      });
      html += `<p>${paragraphContent}</p>`;
    } else if (node.type === 'heading' && node.tag) {
      html += `<h${node.tag}>${node.children?.map((c: LexicalNode) => c.text).join('')}</h${node.tag}>`;
    } else if (node.type === 'list' && node.listType) {
      const listTag = node.listType === 'bullet' ? 'ul' : 'ol';
      let listItems = '';
      node.children?.forEach((listItem: LexicalNode) => {
        if (listItem.type === 'listitem') {
          let itemContent = '';
          listItem.children?.forEach((child: LexicalNode) => {
            if (child.type === 'text') {
              itemContent += child.text;
            }
            // Handle other inline nodes within list items
          });
          listItems += `<li>${itemContent}</li>`;
        }
      });
      html += `<${listTag}>${listItems}</${listTag}>`;
    } else if (node.type === 'horizontalrule') {
      html += `<hr />`;
    }
    // Add more block node types (e.g., image, quote, code) as needed
  });

  return html;
}
