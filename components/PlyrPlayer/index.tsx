import { useRef, useEffect, forwardRef } from "react"
import Plyr, { PlyrOptions, PlyrSource, APITypes } from "plyr-react"

interface PlyrProps {
  source: PlyrSource;
  options?: PlyrOptions;
}

export const PlyrPlayer = forwardRef<HTMLVideoElement, PlyrProps>((props, ref) => {
  const {
    source,
    options = {
      autoplay: false,
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', "fullscreen"],
      volume: 70,
  }, ...rest } = props
  const refApi = useRef<APITypes>(null);

  const plyrVideo =
    source ? (
      <Plyr
        style={{
          borderRadius: 10,
        }}
        ref={refApi}
        source={source}
        options={options}
      />
    ) : null;

  return <div style={{
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
  }}>{plyrVideo}</div>
})