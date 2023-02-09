import { useState } from 'react'
import { StyledNetwork, styles } from './styles'
import ArrowIcon from 'assets/vectors/arrow-down.svg'
import { CHAIN_DETAILS } from 'utils/constants'
import { COLORS_DARK_THEME } from 'theme/colors'
import globusIcon from 'assets/vectors/globus-icon.svg'
import grayGlobusIcon from 'assets/vectors/gray-globus-icon.svg'
import { Typography, Box, Collapse } from '@mui/material'
import { chainIDToAlias, handleAvailableNetworks } from 'utils/helpers'
import { RootState } from 'store'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from 'store/user'
import { connectUser } from 'utils/config'
import { useEffect } from 'react'
import { updateModalState } from 'store/modals'

const NetworkInfo = () => {

  const dispatch = useDispatch()
  const { chosenNetwork, connectedLedger } = useSelector((state: RootState) => state.userState)
  const networksToDisplayInMenu = handleAvailableNetworks(CHAIN_DETAILS.DEFAULT_NETWORK)
  const collapsable = networksToDisplayInMenu.length > 1
  const aliasChainName = chainIDToAlias(CHAIN_DETAILS.CHAIN_ID[chosenNetwork!])
  const [open, setOpen] = useState(false)

  const setSelectedNetwork = (selectedNetwork: string) => {
    dispatch(updateUser({ chosenNetwork: selectedNetwork }))
    setOpen(false)
  }

  useEffect(() => {
    const reconnect = async () => {
      try {
        dispatch(updateModalState({
          loading: true,
          loadingType: true
        }))
        const reconnectedUser = await connectUser(chosenNetwork!, connectedLedger!)
        dispatch(updateUser(reconnectedUser))

      } catch (error) {
        console.error((error as Error).message)

      } finally {
        dispatch(updateModalState({
          loading: false,
          loadingType: false
        }))
      }
    }

    reconnect()
    //eslint-disable-next-line
  }, [chosenNetwork])

  const NetworkLinkComponent = ({ network, key }: { network: networkToDisplay, key: number }): JSX.Element => {

    const [hovered, setHovered] = useState<boolean>(false)

    return (
      <Box
        style={styles.anchorStyle}
        key={key}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onClick={() => setSelectedNetwork(network.SHORT_NAMES[0].toUpperCase())}
      >
        <img
          style={{ marginRight: '10px' }}
          src={hovered ? globusIcon : grayGlobusIcon}
          alt="globus-icon"
        />
        <Typography
          color={hovered ? COLORS_DARK_THEME.PRIMARY_BLUE : COLORS_DARK_THEME.SECONDARY_TEXT}>
          {network.ALIAS_NAME}
        </Typography>
      </Box>
    )
  }

  return (
    <StyledNetwork sx={collapsable ? { cursor: 'pointer' } : {}}>
      <Box
        onClick={collapsable ? () => setOpen(!open) : () => { }}
        style={styles.userContainer}
      >
        <Box style={styles.userInnerContainer}>
          <img style={{ marginRight: '10px' }} src={globusIcon} alt="globus-icon" />
          <Typography>
            {aliasChainName}
          </Typography>
          {collapsable ?
            <Box style={{ marginLeft: '15px' }}>
              <img
                style={{
                  cursor: 'pointer',
                  transform: open ? 'rotate(180deg)' : 'rotate(360deg)'
                }}
                src={ArrowIcon}
                alt="Arrow Icon"
              />
            </Box> : null}
        </Box>
      </Box>
      <Collapse
        onMouseLeave={() => setOpen(false)}
        style={{ marginTop: '-28px', zIndex: '-1' }}
        in={open}
      >
        <Box gap={3} style={styles.networkSelectionMenuContainer}>
          {networksToDisplayInMenu.map((NETWORK, idx) => {
            return aliasChainName !== NETWORK.ALIAS_NAME ?
              <NetworkLinkComponent key={idx} network={NETWORK} /> : null
          })}
        </Box>
      </Collapse>
    </StyledNetwork>
  )
}

export default NetworkInfo
