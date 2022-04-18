/* eslint-disable react/display-name */
import type { MantineTheme } from '@mantine/core';
import { createStyles, Paper } from '@mantine/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

import BubbleMenu from './MenuBar/BubbleMenu';
import MenuBar from './MenuBar/HeaderMenu';

const mainSx = (theme: MantineTheme) => {
  const isDark = theme.colorScheme === 'dark';
  return {
    '.ProseMirror': {
      padding: '0 16px',
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
  // editor.commands.setImage({ src: 'https://example.com/foobar.png', alt: 'A boring example image', title: 'An example' })
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
    ],
    content:
      '<h1>Hello <mark data-color="#ffa8a8" style="background-color: #ffa8a8">world</mark></h1><p>Hello world</p><p>Hello world</p><p>Hello world</p><p>Hello world</p>',
    autofocus: true,
    editable: true,
    injectCSS: true,
    onUpdate: ({ editor }) => {
      // const html = editor.getHTML();
      // console.log(html);
    },
  });

  useEffect(() => {
    editor && console.log(editor);
  }, [editor]);

  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
  const [parent, setParent] = useState<HTMLDivElement | null>(null);
  const [tippy, setTippy] = useState<any>(null);
  const onTippyUpdate = (tippy: any) => {
    const { popper } = tippy;
    if (!popper || !wrapper) return;
    const { top: top1 } = popper.getBoundingClientRect();
    const { top: top2, bottom: bottom2 } = wrapper.getBoundingClientRect();
    if (top1 === 0) {
      popper.style.opacity = '1';
      return true;
    }
    if (top1 - top2 < 0 || top1 - bottom2 > 0) {
      console.log(0);
      popper.style.opacity = '0';
      return false;
    } else {
      popper.style.opacity = '1';
      return true;
    }
  };

  return (
    <Paper
      radius={0}
      p={0}
      sx={mainSx as any}
      style={{ maxWidth: '800px', position: 'relative' }}
      shadow="sm">
      <div ref={setParent} />
      <BubbleMenu
        editor={editor}
        parent={parent}
        setTippy={setTippy}
        onTippyUpdate={onTippyUpdate}
      />
      <MenuBar editor={editor} />
      <Paper
        ref={setWrapper}
        radius={0}
        m={0}
        px={16}
        py={32}
        withBorder
        onScroll={() => {
          onTippyUpdate(tippy);
        }}
        style={{
          borderTop: 'none',
          maxHeight: '500px',
          minHeight: '200px',
          overflow: 'auto',
        }}>
        <EditorContent editor={editor} />
      </Paper>
    </Paper>
  );
};
