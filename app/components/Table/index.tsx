/* eslint-disable react/jsx-key */
import { Box, createStyles, ScrollArea, Table } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { useTable } from 'react-table';

const useStyles = createStyles((theme) => ({
  container: {
    position: 'relative',
    th: {
      whiteSpace: 'nowrap',
    },
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    background: '#fff',
    zIndex: 1,
  },
  header: {
    overflow: 'auto scroll',
    width: '100%',
  },
  body: {
    overflow: 'auto scroll',
    width: '100%',
    height: '100%',
  },
}));

const YTable = ({
  columns,
  data,
  style,
}: {
  columns: any[];
  data: any[];
  style: any;
}) => {
  const { classes } = useStyles();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  /** 滚动逻辑 👇*/
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    viewport?.current?.scrollTo({ left: scrollPosition.x });
  }, [scrollPosition]);
  /** 滚动逻辑 👆*/

  const [widths, setWidths] = useState<number[]>();
  const ref = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    try {
      const widthArr: number[] = [];
      ref.current?.childNodes[0].childNodes.forEach((v: any) =>
        widthArr.push(v?.offsetWidth as number),
      );
      console.log(widthArr);
      setWidths(widthArr);
    } catch (e) {
      console.log(e);
    }
  }, [ref]);

  return (
    <Box className={classes.container} style={style}>
      <div className={classes.headerWrapper}>
        <ScrollArea
          className={classes.header}
          styles={{
            root: { '&::-webkit-scrollbar': { width: 0 } },
            scrollbar: { display: 'none' },
          }}
          viewportRef={viewport}>
          <Table {...getTableProps()}>
            <colgroup>
              {widths?.map((width) => {
                return (
                  <col
                    key={width}
                    style={{
                      width: width,
                      minWidth: width,
                      maxWidth: width,
                    }}></col>
                );
              })}
            </colgroup>
            {widths && (
              <thead ref={ref}>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            )}
          </Table>
        </ScrollArea>
      </div>

      <ScrollArea
        className={classes.body}
        styles={{
          root: { '&::-webkit-scrollbar': { width: 0 } },
          scrollbar: { zIndex: 2 },
          thumb: { '&::before': { minWidth: 0 } },
        }}
        onScrollPositionChange={onScrollPositionChange}>
        <Table {...getTableProps()} highlightOnHover>
          <thead ref={ref}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
};

export default YTable;
