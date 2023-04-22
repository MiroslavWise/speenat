export const srcImage = (item: string) => {
        if (item?.includes('default')) {
                return '/images/default.png'
        } else {
                return item 
        }
}