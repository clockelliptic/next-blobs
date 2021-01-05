import { useEffect, useState } from 'react'

export default function useTopMarginAdjust () {
    const [topMarginAdjust, setTopMarginAdjust] = useState(0)

    useEffect(() => {
        // on page load, adjust position for the global page header
        setTopMarginAdjust(-1 * Number(document.getElementById('global-header').clientHeight))
    }, [])

    return topMarginAdjust;
}