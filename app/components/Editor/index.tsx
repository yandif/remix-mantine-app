/* eslint-disable react/display-name */
import type { MantineTheme } from '@mantine/core';
import { createStyles, Paper } from '@mantine/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import MenuBar from './MenuBar';
import BubbleMenu from './MenuBar/BubbleMenu';
const a = [
  'blockquote',
  'bold',
  'bulletList',
  'code',
  'codeBlock',
  'document',
  'dropcursor',
  'gapcursor',
  'hardBreak',
  'heading',
  'history',
  'horizontalRule',
  'italic',
  'listItem',
  'orderedList',
  'paragraph',
  'strike',
  'text',
];

const mainSx = (theme: MantineTheme) => {
  const isDark = theme.colorScheme === 'dark';
  return {
    '.ProseMirror': {
      padding: '0 16px',
      '& *': {
        wordBreak: 'break-all',
        '&::selection': {
          background: isDark ? '#555' : '#ddd',
        },
      },
      '&:focus': {
        outline: 'none',
      },
    },
  };
};

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';
  return {
    main: {
      paddingTop: 80,
      paddingBottom: 80,
    },
  };
});

export default () => {
  const { classes, cx } = useStyles();

  const editor = useEditor({
    extensions: [StarterKit],
    content: ' <h1>Hello world</h1><br/><br/>',
    autofocus: true,
    editable: true,
    injectCSS: false,
  });

  return (
    <Paper
      radius={0}
      p={0}
      sx={mainSx as any}
      style={{ maxWidth: '560px' }}
      shadow="sm">
      <BubbleMenu editor={editor} />
      <MenuBar editor={editor} />
      <Paper radius={0} m={0} p={16} withBorder style={{ borderTop: 'none' }}>
        <EditorContent editor={editor} />
      </Paper>
    </Paper>
  );
};
