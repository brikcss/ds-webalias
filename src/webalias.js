/*! webalias.js | @author Brikcss (https://github.com/brikcss) */
/* globals fetch */

// -------------------------------------------------------------------------------------------------
// Imports.
//

import { LitElement, html, css, unsafeCSS } from 'lit-element'

// -------------------------------------------------------------------------------------------------
// WebAlias.
//

class WebAlias extends LitElement {
  /**
   * WebAlias Constructor.
   * @param  {Array} args  Arguments array.
   */
  constructor (...args) {
    super(args)
    if (!WebAlias.initialized) WebAlias.checkUrl()
    this.prefix = ''
    this.suffix = ''
  }

  /**
   * LitElement properties.
   * @return {Object}
   */
  static get properties () {
    return {
      webalias: { type: String },
      client: { type: String },
      prop: { type: String },
      content: { type: String, reflect: false },
      prefix: { type: String },
      suffix: { type: String },
      display: { type: String }
    }
  }

  /**
   * Map of WebAlias properties to return data.
   * @return {Object}  Each property can be a String, which maps to a property for the return
   *     webalias data; or a Function, which runs with the return data passed as a function
   *     parameter.
   */
  static get propsMap () {
    return {
      first: 'FirstName',
      last: 'LastName',
      name: (data) => data.FirstName + ' ' + data.LastName,
      email: 'Email',
      phone: (data) => data.Phone1,
      phone1: 'Phone1',
      phone2: 'Phone2',
      city: 'City',
      state: 'State',
      country: 'Country',
      about: 'AboutMe',
      company: 'Company',
      language: 'MemberLanguage',
      profileImage: (data) => html`<img src="${data.ImageUrl}" alt="${WebAlias.propsMap.name(data)}" />`,
      imageData: 'ImageData',
      facebook: 'Facebook',
      twitter: 'Twitter',
      pinterest: 'Pinterest',
      youTube: 'YouTube',
      linkedIn: 'Linkdin',
      enrollmentUrl: 'EnrollmentUrl',
      officeUrl: 'OfficeUrl',
      shoppingUrl: 'ShoppingLink',
      replicatedSiteUrl: 'ReplicatedSiteUrl',
      webalias: 'WebAlias',
      customerId: 'CustomerID',
      backOfficeId: 'BackOfficeID',
      customerTypeId: 'CustomerTypeId',
      status: 'Status'
    }
  }

  /**
   * LitElement styles property.
   * @return  {Function}  CSS tagged template literal.
   */
  static get styles () {
    return css`
      :host([hidden]) {
        display: none;
      }
      :host {
        display: inline;
      }
    `
  }

  /**
   * Checks and parses the URL to grab the client ID, webalias, and environment WebAlias needs to
   * work. Then updates these global configuration properties.
   */
  static checkUrl () {
    const host = window.location.hostname.split('.').filter(segment => segment !== 'www')
    const config = {
      webalias: null,
      client: null,
      env: null
    }
    if (!host || !host.length) return
    config.env = host.slice(-1)[0]
    if (config.env.includes('localhost')) config.env = 'dev'
    if (config.env.includes('directscale')) config.env = config.env.replace('directscale', '')
    if (host.length > 1) config.webalias = host[0]
    if (host.length > 2) {
      config.client = host[1]
    }

    WebAlias.initialized = true
    WebAlias.updateConfig(config)
  }

  /**
   * Updates the global client, webalias, and env properties.
   * @param  {Object} config  Global configuration properties (client, webalias, env).
   */
  static updateConfig (config = {}) {
    const allowableKeys = ['client', 'webalias', 'env']
    Object.keys(config).forEach(key => {
      if (!allowableKeys.includes(key) || WebAlias.prototype[key] === config[key]) return
      WebAlias.prototype[key] = config[key]
    })
  }

  /**
   * LitElement lifecycle. Called the first time this instance is updated.
   * @param  {Map} changedProps  Map of changed properties.
   */
  firstUpdated (changedProps) {
    this.updateWebalias()
  }

  /**
   * LitElement lifecycle. Called each time this instance is updated.
   * @param  {Map} changedProps  Map of changed properties.
   */
  updated (changedProps) {
    this.updateWebalias()
  }

  /**
   * Fetch and update the webalias data from the DirectScale API.
   */
  updateWebalias () {
    if (!this.webalias || !this.client || !this.prop) {
      this.content = ''
      return
    }
    // If fetch is already in progress, use it.
    if (WebAlias.activeWebalias instanceof Promise) {
      WebAlias.activeWebalias.then(() => this.updateContent())
    // If cached data exists, use it.
    } else if (WebAlias.activeWebalias) {
      this.updateContent()
    // Otherwise, fetch webalias data and cache it.
    } else {
      WebAlias.activeWebalias = fetch(`https://api2.directscale${this.env}.com/api/Repsite/GetCustomerSite?webAlias=${this.webalias}`, {
        headers: {
          ApplicationUrl: `https://${this.webalias}.${this.client}.directscale${this.env}.com`
        }
      }).then(response => response.json()).then(result => {
        // Normalize data.
        WebAlias.activeWebalias = Object.keys(WebAlias.propsMap).reduce((data, prop) => {
          const key = WebAlias.propsMap[prop]
          data[prop] = typeof key === 'function' ? key(result) : result[key]
          return data
        }, {})
        this.updateContent()
        return WebAlias.activeWebalias
      })
    }
  }

  /**
   * Update this.content with the configured webalias data property.
   */
  updateContent () {
    this.content = WebAlias.activeWebalias && WebAlias.activeWebalias[this.prop] ? WebAlias.activeWebalias[this.prop] : ''
  }

  /**
   * LitElement render. Called after going through the update lifecycle.
   * @return {Function}  LitElement's html tag function.
   */
  render () {
    if (!this.webalias || !this.client || !this.prop || !WebAlias.activeWebalias) {
      this.content = ''
      return
    }
    let styles = ''
    if (this.display) {
      styles = html`<style>:host { display: ${unsafeCSS(this.display)}; }</style>`
    }
    return html`${styles}${this.prefix}${this.content}${this.suffix}`
  }
}

// WebAlias prototype and class-side properties.
WebAlias.initialized = false
WebAlias.activeWebalias = undefined
WebAlias.prototype.client = ''
WebAlias.prototype.webalias = ''
WebAlias.prototype.env = 'dev'

// -------------------------------------------------------------------------------------------------
// Exports.
//

export { WebAlias }
