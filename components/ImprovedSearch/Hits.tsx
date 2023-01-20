import type { Hit } from "instantsearch.js"
import type { SendEventForHits } from "instantsearch.js/es/lib/utils"
import { Hits as AlgoliaHits } from "react-instantsearch-hooks-web"

type Props = {
  hitComponent: React.JSXElementConstructor<{
    hit: Hit
    sendEvent: SendEventForHits
  }>
}

export const Hits = ({ hitComponent }: Props) => <AlgoliaHits hitComponent={hitComponent} />
