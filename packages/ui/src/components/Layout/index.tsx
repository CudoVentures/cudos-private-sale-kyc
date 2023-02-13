import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import Footer from './Footer'
import Header from './Header'
import { layoutStyles } from './styles'

const footerHeight = 80

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const location = useLocation()
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight - footerHeight,
    })

    const resizeHanlder = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        setWindowSize({
            width: width,
            height: height - footerHeight,
        })
    }

    useEffect(() => {
        window.addEventListener('resize', resizeHanlder);

        return () => {
            window.removeEventListener('resize', resizeHanlder);
        }
    }, [])

    return (
        <Box id='appWrapper' sx={layoutStyles.appWrapper} >
            <Header />
            <Box sx={layoutStyles.contentHolder}>
                <Box
                    minHeight={`${windowSize.height}px`}
                    id='contentWrapper'
                    marginTop={15}
                    sx={layoutStyles.contentWrapper}>
                    {children}
                    {location.pathname === '/' ? null : <Footer />}
                </Box>
            </Box>
        </Box>
    )
}

export default Layout
