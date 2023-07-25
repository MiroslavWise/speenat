import { type ReactNode } from "react"
import { motion } from "framer-motion"

import { motionOpacityY } from "functions/motion"
import { cx } from "functions/cx"

export const MotionUL = ({ children, classNames }: { children: ReactNode, classNames: any[] }) => {
  return (
    <motion.ul
      className={cx(classNames)}
      variants={motionOpacityY}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.ul>
  )
}