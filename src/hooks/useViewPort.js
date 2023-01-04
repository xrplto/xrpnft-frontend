import { useContext } from "react"
import { viewportContext } from "utils/ViewportProvider"

export const useViewPort = () => {
    const { width, height } = useContext(viewportContext)

    return { width, height }
}