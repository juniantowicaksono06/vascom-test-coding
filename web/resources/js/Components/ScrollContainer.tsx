import React, { useEffect } from 'react'
import { useSelector } from "react-redux"
import { useState, useRef } from "react"
const ScrollContainer = (props:  {
    children: React.ReactNode
}) => {

    const containerRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null)

    let [containerHeight, setContainerHeight] = useState(0)
    let topbarHeight = 100;
    function calculateViewHeight() {
        let result = window.innerHeight
        setContainerHeight(result - topbarHeight)
    }

    useEffect(() => {
        calculateViewHeight()
        window.addEventListener('resize', () => {
            calculateViewHeight()
        })
    }, [])


    return (
        <>
            <div className="scroll-container" ref={containerRef} style={{
                height: `${containerHeight}px`
            }}>
                {props.children}
            </div>
        </>
    )
}

export default ScrollContainer