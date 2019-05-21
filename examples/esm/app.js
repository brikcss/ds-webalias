// -------------------------------------------------------------------------------------------------
// App code.
//

import { WebAlias } from '../../dist/esm/webalias.browser.js'

// Configure WebAlias.
WebAlias.client = 'newu'

// Register new <web-alias/> element.
window.customElements.define('web-alias', WebAlias)
