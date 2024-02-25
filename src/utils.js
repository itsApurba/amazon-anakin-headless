import { htmlToText } from "html-to-text";

export const cleanHtml = (html) => {
  if (!html) {
    return html;
  }
  html = htmlToText(html, {
    wordwrap: false,
    selectors: [{ selector: "a", options: { ignoreHref: true } }],
  });
  // Remove multiple \n with one \n
  html = html.replace(/\n+/g, "\n");
  // if it has one \n then replace it with a space
  // html = html.replace(/\n/g, " ");
  return html;
};
