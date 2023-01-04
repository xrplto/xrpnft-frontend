import React, { useEffect, useState } from 'react'

export const viewportContext = React.createContext({});
const ViewportProvider = ({ children }) => {
    const [width, setWidth] = useState(null)
    const [height, setHeight] = useState(null)

    useEffect(() => {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)

        const handleWindowResize = () => {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        }
        window.addEventListener("resize", handleWindowResize)
        return () => {
            window.removeEventListener("resize", handleWindowResize)
        }
    }, [])

    return (
        <viewportContext.Provider value={{ width, height }}>
            {children}
        </viewportContext.Provider>
    )
}

export default ViewportProvider


