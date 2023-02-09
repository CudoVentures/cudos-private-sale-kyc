import { Box, Tooltip } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateModalState } from 'store/modals'
import { initialState as initialModalState } from 'store/modals'
import { ModalContainer, styles as defaultStyles } from 'components/Dialog/styles'
import { Coin } from 'cudosjs'
import { updateUser } from 'store/user'
import { Search, SearchIconWrapper, selectableBox, StyledInputBase, styles } from './styles'
import { cutFractions, handleBalanceToFullBalance } from 'utils/regexFormatting'
import { DENOM_TO_ALIAS, DENOM_TO_ICON } from 'utils/constants'
import unknownLogoIcon from 'assets/vectors/questionmark-icon.svg'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'

const BalanceSelector = () => {

  const { changeChosenBalance } = useSelector((state: RootState) => state.modalState)
  const { balances } = useSelector((state: RootState) => state.userState)
  const [searchTerms, setSearchTerms] = useState<string>('')
  const dispatch = useDispatch()

  const handleModalClose = () => {
    dispatch(updateModalState({ ...initialModalState }))
  }

  const setBalance = (selectedBalance: Coin) => {
    dispatch(updateUser({ chosenBalance: selectedBalance }))
    handleModalClose()
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchTerms(event.target.value)
  }

  const filterBySearchTerms = (item: Coin): boolean => {
    const denom: string = DENOM_TO_ALIAS[item.denom] || item.denom
    if (denom.toLowerCase().includes(searchTerms.toLowerCase())) {
      return true
    }
    return false
  }

  return (
    <MuiDialog
      BackdropProps={defaultStyles.defaultBackDrop}
      open={changeChosenBalance!}
      onClose={handleModalClose}
      PaperProps={styles.paperProps}
    >
      <ModalContainer sx={{ padding: '25px 25px 20px 30px' }}>
        <Box
          width='max-content'
          minHeight='200px'
          display="block"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={1}
        >
          <Box marginBottom={2}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                value={searchTerms}
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleChange}
              />
            </Search>
          </Box>
          <Box gap={1.5} flexDirection={'column'} style={styles.balanceMapper}>
            {balances!.filter(filterBySearchTerms).map((balance, idx) => {
              const fullBalance = handleBalanceToFullBalance(balance)
              const displayBalance = cutFractions(fullBalance)
              const displayName = DENOM_TO_ALIAS[balance?.denom!] || balance?.denom!
              const displayLogo = DENOM_TO_ICON[balance?.denom!] || unknownLogoIcon
              const balanceToSet: Coin = {
                denom: balance.denom,
                amount: balance.amount
              }

              return (
                <Box onClick={() => setBalance(balanceToSet)} sx={selectableBox} key={idx} style={{ padding: '10px', display: 'flex' }}>
                  <Tooltip title={`${fullBalance} ${displayName}`}>
                    <Box display={'flex'} alignItems={'center'}>
                      <img src={displayLogo} alt="Token logo" />
                      <span style={{ margin: '0 5px 0 10px' }}>{displayBalance}</span>
                      {displayName}
                    </Box>
                  </Tooltip>
                </Box>
              )
            })
            }
          </Box>
        </Box>
      </ModalContainer>
    </MuiDialog>
  )
}

export default BalanceSelector
