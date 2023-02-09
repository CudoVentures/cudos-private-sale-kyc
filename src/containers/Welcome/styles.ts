import theme from "theme";

export const styles = {
  contentHolder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minWidth: '1000px',
    height: '700px',
    border: `1px solid ${theme.dark.palette.primary.main}`
  }
} as const
