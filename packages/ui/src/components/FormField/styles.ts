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
    padding: '16px 20px',
    borderRadius: '8px',
    width: '50%',
    background: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY
  }
}

export const getInvalidInputStyling = (type: 'text' | 'number', index: number) => {
  if (index === 0) {
    return {
      ...styles.tierInput,
      borderTop: `0.1px solid ${COLORS_DARK_THEME.TESTNET_ORANGE}`,
      borderLeft: type === 'text' ? `0.1px solid ${COLORS_DARK_THEME.TESTNET_ORANGE}` : undefined,
      borderRight: type === 'number' ? `0.1px solid ${COLORS_DARK_THEME.TESTNET_ORANGE}` : undefined
    }
  }

  if (index === 4) {
    return {
      ...styles.tierInput,
      borderBottom: `0.1px solid ${COLORS_DARK_THEME.TESTNET_ORANGE}`,
      borderLeft: type === 'text' ? `0.1px solid ${COLORS_DARK_THEME.TESTNET_ORANGE}` : undefined,
      borderRight: type === 'number' ? `0.1px solid ${COLORS_DARK_THEME.TESTNET_ORANGE}` : undefined
    }
  }

  if (type === 'text') {
    return {
      ...styles.tierInput,
      borderLeft: `0.1px solid ${COLORS_DARK_THEME.TESTNET_ORANGE}`,
    }
  }

  if (type === 'number') {
    return {
      ...styles.tierInput,
      borderRight: `0.1px solid ${COLORS_DARK_THEME.TESTNET_ORANGE}`,
    }
  }
  return styles.tierInput
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
        width: '250px',
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
  totalPopper: {
    sx: {
      zIndex: '1'
    },
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [-10, -25]
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
