


const nameRoute = (route: string): string => {
        const split = route.split('/').filter(_ => _)
        
        return split[0] || ""
}