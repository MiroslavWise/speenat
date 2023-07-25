export const motionOpacityY = {
  hidden: { opacity: 0, scale: 0, },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.15,
    },
  },
}

export const motionItemOnOpacityY = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}