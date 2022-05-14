import type { MantineTheme, PaperProps, Sx } from '@mantine/core';
import { createStyles, Paper } from '@mantine/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import _ from 'lodash';
import type { ReactNode } from 'react';

const mainSx = (theme: MantineTheme) => {
  const isDark = theme.colorScheme === 'dark';

  return {
    background: isDark ? theme.colors.dark[5] : theme.white,
    '.ProseMirror': {
      padding: '0 16px',
      background: isDark ? theme.colors.dark[5] : theme.white,
      '& *': {
        wordBreak: 'break-all',
        '&::selection': {
          background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
        },
      },
      '&:focus': {
        outline: 'none',
      },
      mark: {
        color: 'inherit',
      },
      'ul[data-type=taskList]': {
        p: {
          margin: '0 0 1px 0',
        },
        li: {
          margin: '4px 0',
        },
      },
      'p.is-empty.is-editor-empty': {
        marginLeft: -4,
        '&::before': {
          color: isDark ? '#5c5f66' : '#adb5bd',
          content: 'attr(data-placeholder)',
          float: 'left',
          height: 0,
          pointerEvents: 'none',
          fontSize: 14,
        },
      },
    },
  };
};

const useStyles = createStyles(() => ({}));

export default function Editor(
  props: PaperProps<'div'> & {
    name?: string;
    value?: string;
    error?: ReactNode | string;
    placeholder?: string;
    autofocus?: boolean;
    onChange: (val: string) => any;
  },
) {
  const handleChange = _.debounce((v) => {
    props.onChange(v);
  }, 300);

  const { theme } = useStyles();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: props.placeholder,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Subscript,
      Superscript,
      underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: props.value,
    autofocus: !!props.autofocus,
    editable: true,
    injectCSS: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleChange(html);
    },
  });

  const borderColor = (() => {
    if (editor?.isFocused) {
      return 'rgb(82, 166, 236)';
    }
    if (props.error) {
      return 'red';
    }
    if (theme.colorScheme === 'dark') {
      return '#1A1B1E';
    }
    return 'rgb(206, 212, 218)';
  })();

  return (
    <Paper
      radius={0}
      m={0}
      p={0}
      withBorder
      sx={mainSx as Sx}
      onClick={() => {
        if (!editor?.isFocused) {
          editor?.commands.focus();
        }
      }}
      style={{
        height: '510px',
        overflow: 'auto',
        cursor: 'text',
        borderColor,
      }}>
      <EditorContent editor={editor} />
    </Paper>
  );
}
