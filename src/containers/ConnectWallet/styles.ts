/* eslint-disable import/prefer-default-export */
export const styles = {
  connectContainer: {
    display: 'grid',
    justifyContent: 'center',
    justifyItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '50%'
  },
  subHeaderContainer: {
    display: 'flex',
    textAlign: 'center'
  },
  connectButton: {
    height: '50px',
    width: '250px',
    marginBottom: '40px'
  },
  pluginWarning: {
    maxWidth: '550px',
    fontSize: '14px',
    height: '60px',
    backgroundColor: 'rgba(82, 166, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    borderRadius: '10px',
    padding: '10px 20px 10px 20px'
  },
  keplrLogo: {
    marginRight: '10px'
  },
  cosmostationLogo: {
    marginRight: '10px',
    height: '25px'
  },
  infoIcon: {
    display: 'flex',
    marginRight: '10px'
  },
  btnsHolder: {
    marginTop: '50px', 
    display: 'flex', 
    justifyContent: 'space-evenly'
  }
} as const