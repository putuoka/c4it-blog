import React, { FunctionComponent } from "react"
import Utterances from "../../../../components/utterances"

/**
 * Placeholder which is attached under every post. Can be shadowed to
 * quickly integrate comments (like commento, Disqus, ...).
 */
// @ts-ignore
const Comments: FunctionComponent<{ id: string }> = ({ id }) => (
  <>
    <div class="s9-widget-wrapper"></div>
    <Utterances repo={`code4it-dev/blog-comments`} />
  </>
)

export default Comments
