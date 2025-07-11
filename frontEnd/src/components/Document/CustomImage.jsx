import { Node, mergeAttributes } from "@tiptap/core";

export const CustomImage = Node.create({
  name: "image",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      style: { default: null },
      id: { default: null }
    }
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: node => ({
          src: node.getAttribute("src"),
          alt: node.getAttribute("alt"),
          title: node.getAttribute("title"),
          style: node.getAttribute("style"),
          id: node.getAttribute("id"),
        })
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },
});
