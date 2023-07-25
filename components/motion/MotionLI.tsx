import { type ReactNode, type DispatchWithoutAction } from "react"
import { motion } from "framer-motion"

import { motionItemOnOpacityY } from "functions/motion"
import { cx } from "functions/cx"

export const MotionLI = ({ children, classNames, onClick }: { children: ReactNode, classNames: any[], onClick?: DispatchWithoutAction }) => {

  const handleClick = () => {
    if (onClick) onClick()
  }

  return (
    <motion.li
      className={cx(classNames)}
      variants={motionItemOnOpacityY}
      onClick={handleClick}
    >
      {children}
    </motion.li>
  )
}