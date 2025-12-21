import Header from "@editorjs/header"
import List from "@editorjs/list"
import Checklist from "@editorjs/checklist"
import Paragraph from "@editorjs/paragraph"
import InlineCode from "@editorjs/inline-code"

export const EDITOR_TOOLS = {
  header: {
    class: Header,
    config: {
      placeholder: "הזן כותרת",
      levels: [2, 3, 4],
      defaultLevel: 3,
    },
  },
  list: {
    class: List,
    config: {
      defaultStyle: "unordered",
    },
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    config: {
      placeholder: "רשום את המחשבות שלך כאן...",
    },
  },
  inlineCode: {
    class: InlineCode,
  },
}
