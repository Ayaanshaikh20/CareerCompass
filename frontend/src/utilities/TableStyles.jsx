
export const muiTableProps = {
  sx: {
    tableLayout: "auto",
    width: "100%",
  },
};

export const muiTableContainerProps = {
  sx: {
    maxWidth: "100%",
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c1c1c1",
      borderRadius: "2px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f1f1f1",
    },
    maxHeight: 410,
    height: 410,
  },
};

export const muiTableBodyRowProps = {
  sx: {
    paddingY: 0.5,
  },
};

export const muiTableBodyCellProps = {
  sx: {
    padding: "8px 8px",
    whiteSpace: "nowrap",
  },
};
