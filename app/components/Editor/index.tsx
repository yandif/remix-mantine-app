/* eslint-disable react/display-name */
import type { MantineTheme, PaperProps } from '@mantine/core';
import { createStyles, Paper } from '@mantine/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
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
import { Fragment } from 'react';

import MenuBar from './MenuBar/HeaderMenu';
const mainSx = (theme: MantineTheme) => {
  const isDark = theme.colorScheme === 'dark';

  return {
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
    },
  };
};

const useStyles = createStyles(() => ({}));

export default (
  props: PaperProps<'div'> & {
    name?: string;
    value?: string;
    error?: ReactNode | string;
    onChange: (val: string) => any;
  },
) => {
  const handleChange = _.debounce((v) => {
    props.onChange(v);
    console.log(v);
  }, 300);

  const { theme } = useStyles();
  const editor = useEditor({
    extensions: [
      StarterKit,
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
    autofocus: true,
    editable: true,
    injectCSS: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleChange(html);
    },
  });

  const borderColor = (() => {
    if (props.error) {
      return 'red';
    }
    if (theme.colorScheme === 'dark') {
      return '#1A1B1E';
    }
    return 'rgb(233, 236, 239)';
  })();

  return (
    <Fragment>
      <Paper
        radius={0}
        p={0}
        sx={mainSx as any}
        style={{ position: 'relative' }}
        {...props}>
        <MenuBar editor={editor} />
        <Paper
          radius={0}
          m={0}
          px={16}
          py={16}
          withBorder
          sx={(theme) => {
            const isDark = theme.colorScheme === 'dark';
            return { background: isDark ? theme.colors.dark[5] : theme.white };
          }}
          onClick={() => {
            if (!editor?.isFocused) {
              editor?.commands.focus();
            }
          }}
          style={{
            maxHeight: '500px',
            minHeight: '200px',
            overflow: 'auto',
            cursor: 'text',
            borderColor,
          }}>
          <EditorContent editor={editor} />
        </Paper>
      </Paper>
    </Fragment>
  );
};
