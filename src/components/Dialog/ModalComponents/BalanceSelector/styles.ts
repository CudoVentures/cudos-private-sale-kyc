import { InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import { COLORS_DARK_THEME } from "theme/colors"

export const styles = {
    paperProps: {
        sx: {
            background: 'transparent',
            width: 'max-content',
            height: 'max-content',
            position: 'absolute',
            top: '1%',
            overflow: 'hidden',
            borderRadius: '25px',
        }
    },
    balanceMapper: {
        display: 'flex',
        width: '100%',
        minWidth: '250px',
        maxHeight: '285px',
        overflow: 'scroll'
    }
}

export const selectableBox = {
    borderRadius: '10px',
    backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND,
    "&:hover": {
        cursor: 'pointer',
        backgroundColor: 'rgba(82, 200, 248, 0.1)'
    },
}

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        backgroundColor: 'rgba(82, 200, 248, 0.02)',
    },
    marginLeft: 0,
    width: '100%',

}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));