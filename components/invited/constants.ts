

interface IButtonsSocial {
  icon: string
  link: string
}

interface IParams{
  text: string
  url: string
}

export const BUTTONS_SOCIAL = ({text, url}: IParams): IButtonsSocial[] => [
  {
    icon: "/svg/social/facebook.svg",
    link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    icon: "/svg/social/telegram.svg",
    link: `https://telegram.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    icon: "/svg/social/vk.svg",
    link: `https://vk.com/share.php?url=${encodeURIComponent(url)}`,
  },
  {
    icon: "/svg/social/whatsapp.svg",
    link: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
]