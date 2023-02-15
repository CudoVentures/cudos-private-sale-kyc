import { COLORS_DARK_THEME } from "theme/colors"

export const styles = {
  tierTitle: {
    position: 'relative',
    alignItems: 'flex-end',
    display: 'flex'
  },
  defaultDropDown: {
    marginRight: '30px',
    fontWeight: 600,
    fontSize: '14px',
    marginTop: '10px',
    padding: '16px 20px',
    height: '64px',
    borderRadius: '8px',
    width: '170px',
    background: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY,
    border: '0px',
    outline: '0px',
  },
  input: {
    border: '0.1px solid transparent',
    marginTop: '10px',
    padding: '16px 20px',
    borderRadius: '8px',
    width: '100%',
    background: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY
  },
  tierInput: {
    border: '0.1px solid transparent',
    marginTop: '10px',
    padding: '16px 20px',
    borderRadius: '8px',
    width: '50%',
    background: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY
  }
}

export const validationStyles = {
  invalidInput: {
    ...styles.input,
    border: `0.1px solid ${COLORS_DARK_THEME.TESTNET_ORANGE}`,
  },
  connectedInput: {
    ...styles.input,
    border: `0.1px solid ${COLORS_DARK_THEME.PRIMARY_BLUE}`,
  },
  connectedTooltipProps: {
    tooltip: {
      sx: {
        marginTop: '-50px',
        background: 'transparent',
        color: COLORS_DARK_THEME.PRIMARY_BLUE
      },
    },
  },
  tooltipProps: {
    tooltip: {
      sx: {
        marginTop: '-50px',
        background: 'transparent',
        color: COLORS_DARK_THEME.TESTNET_ORANGE
      },
    },
  },
  tierTooltipProps: {
    tooltip: {
      sx: {
        padding: '15px',
        borderRadius: '15px',
        background: "rgba(16, 18, 26, 0.8)",
        backdropFilter: 'blur(12px)',
        color: COLORS_DARK_THEME.SECONDARY_TEXT
      },
    },
  },
  tierTooltipPopper: {
    sx: {
      zIndex: '1',
    },
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [50, 50]
        },
      },
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['left-end'],
          flipVariations: false, // true by default
        },
      },
    ],
  },
  tooltipPopper: {
    sx: {
      zIndex: '1'
    },
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -10]
        },
      },
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['bottom-start'],
          flipVariations: false, // true by default
        },
      },
    ],
  }
}
