/* globals fetch */

// -------------------------------------------------------------------------------------------------
// Imports.
//

import BrikElement from '@brikcss/element'
import { hyper } from 'hyperhtml'

// -------------------------------------------------------------------------------------------------
// WebAlias.
//

class WebAlias extends BrikElement {
  static get observedAttributes () {
    return ['prop', 'before', 'after', 'display']
  }

  /**
   * Map of WebAlias properties to return data.
   * @return {Object}  Each property can be a String or Function. A String will map to a property in
   *     the returned webalias data. A Function can be used for a computed property, or to wrap a
   *     property value in other code. A Function receives `data` as a parameter, which is the
   *     returned webalias data.
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
      imageUrl: 'ImageUrl',
      image: (data) => () => hyper()([`<img src="${data.ImageUrl}" alt="${WebAlias.propsMap.name(data)}" />`]),
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
   * Checks and parses the URL to grab the client ID, webalias, and environment WebAlias needs to
   * work. Then updates these global configuration properties.
   */
  static checkUrl () {
    const host = window.location.hostname
    const config = {}
    if (!host || !host.length) return

    // Iterate through keys in urlCheck to get those configurations from the url.
    if (WebAlias.urlCheck === true) WebAlias.urlCheck = ['webalias', 'client', 'env']
    WebAlias.urlCheck.forEach(key => {
      config[key] = WebAlias[`get${key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}FromUrl`](host)
    })

    // Update the configuration.
    WebAlias.updateConfig(config)
  }

  /**
   * Gets the webalias from the url.
   *
   * @param {String} host  The hostname from window.location.
   * @return {string}  The webalias from the url.
   */
  static getWebaliasFromUrl (host) {
    if (host === undefined) host = window.location.hostname
    return host.split('.').filter(segment => segment !== 'www')[0]
  }

  /**
   * Get the client name from the url.
   *
   * @param {String} host  The hostname from window.location.
   * @return {String}  The client name from the url.
   */
  static getClientFromUrl (host) {
    if (host === undefined) host = window.location.hostname
    return host.split('.').filter(segment => segment !== 'www')[1]
  }

  /**
   * Get the environment from the url.
   *
   * @param {String} host  The Hostname from window.location.
   * @return {String}  The environment.
   */
  static getEnvFromUrl (host) {
    if (host === undefined) host = window.location.hostname
    if (host.includes('directscale.com')) return ''
    if (host.includes('directscalestage.com')) return 'stage'
    return 'dev'
  }

  /**
   * Updates the global client, webalias, and env properties.
   * @param  {Object}  config  Global configuration properties (client, webalias, env).
   */
  static updateConfig (config = {}) {
    const allowableKeys = ['client', 'webalias', 'env', 'sourceUrl']
    Object.keys(config).forEach(key => {
      if (!allowableKeys.includes(key) || WebAlias[key] === config[key]) return
      WebAlias[key] = config[key]
    })
  }

  /**
   * Normalizes WebAlias.user.
   * @return {Object}  Normalized WebAlias.user.
   */
  static normalize (webalias = WebAlias.user) {
    // Return the normalized webalias user data.
    return Object.keys(WebAlias.propsMap).reduce((data, prop) => {
      const key = WebAlias.propsMap[prop]
      data[prop] = typeof key === 'function' ? key(webalias) : webalias[key]
      return data
    }, {})
  }

  /**
   * Instance constructor.
   *
   * @param  {Array}  args  Arguments
   */
  constructor (...args) {
    super(args)
    if (!WebAlias.initialized && !WebAlias.urlCheck) {
      WebAlias.initialized = true
    } else if (WebAlias.urlCheck && WebAlias.urlCheck.length) {
      WebAlias.checkUrl()
      WebAlias.initialized = true
    }
    // Set default properties.
    this.prop = this.getAttribute('prop')
    this.display = this.getAttribute('display') || ''
    this.before = this.getAttribute('before') || ''
    this.after = this.getAttribute('after') || ''
    // Create dom.
    this.$ = {
      styles: document.createElement('style')
    }
    // Flag as initialized.
    this.__initialized = true
  }

  /**
   * Lifecycle callback: When a DOM/HTML attribute changes.
   *
   * @param   {string}  name      Attribute name that changed.
   * @param   {string}  oldValue  Previous attribute value.
   * @param   {string}  value     New attribute value.
   */
  attributeChangedCallback (name, oldValue, value) {
    if (!this.__initialized) return
    if (oldValue === value) return
    this[name] = value
    this.render()
  }

  /**
   * Lifecycle callback: When an instance is connected to the DOM (all elements/attributes exist).
   */
  connectedCallback () {
    this.updateWebalias()
  }

  /**
   * Fetch and update the webalias data from the DirectScale API.
   */
  updateWebalias () {
    if (!WebAlias.webalias || !WebAlias.client || !this.prop) {
      return
    }
    // If fetch is already in progress, use it.
    if (WebAlias.user instanceof Promise) {
      WebAlias.user.then(() => this.render())
    // If cached data exists, use it.
    } else if (WebAlias.user) {
      this.render()
    // If webalias exists in localStorage, use it (this offers a quicker UI update). Then fetch
    // latest webalias data in background and cache it to localStorage.
    } else {
      // First check local storage and update UI if correct webalias data already exists...
      if (window.localStorage.webalias) {
        const webalias = WebAlias.normalize(JSON.parse(window.localStorage.webalias))
        if (webalias && webalias.webalias && webalias.webalias.toLowerCase() === WebAlias.webalias.toLowerCase()) {
          WebAlias.user = webalias
          this.render()
        }
      }
      // Now fetch up-to-date data and update the UI.
      const promise = this.fetchWebalias().then(webalias => {
        if (!webalias || !(webalias instanceof Object)) {
          console.error('No user data found.', { webalias: WebAlias.webalias, client: WebAlias.client })
          WebAlias.user = null
          this.render()
          return null
        }
        window.localStorage.webalias = JSON.stringify(webalias)
        WebAlias.user = WebAlias.normalize(webalias)
        this.render()
        return webalias
      })
      if (!WebAlias.user) WebAlias.user = promise
    }
  }

  /**
   * Fetch webalias user data from API2 database.
   * @return {Object}  Normalized webalias user data.
   */
  fetchWebalias () {
    return fetch(`https://api2.directscale${WebAlias.env}.com/api/Repsite/GetCustomerSite?webAlias=${WebAlias.webalias}`, {
      headers: {
        ApplicationUrl: (typeof WebAlias.sourceUrl === 'function' ? WebAlias.sourceUrl() : WebAlias.sourceUrl) || `https://${WebAlias.webalias}.${WebAlias.client}.directscale${WebAlias.env}.com`
      }
    }).then(response => response.json())
  }

  /**
   * Render element's markup to the DOM.
   *
   * @return  {html}  DOM element and children.
   */
  render () {
    if (!this.__initialized || !WebAlias.webalias || !WebAlias.client || !this.prop || !WebAlias.user || !WebAlias.user[this.prop] || WebAlias.user instanceof Promise) {
      return
    }
    let styles = ''
    if (this.display) {
      styles = hyper(this.$.styles)`:host { display: ${this.display}; color: red; }`
    }
    return hyper(this.root)`${styles}${this.before}${WebAlias.user[this.prop]}${this.after}`
  }
}

// WebAlias prototype and class-side properties.
WebAlias.initialized = false
WebAlias.user = undefined
WebAlias.urlCheck = ['webalias']
WebAlias.client = ''
WebAlias.webalias = ''
WebAlias.env = 'dev'
WebAlias.sourceUrl = undefined

// -------------------------------------------------------------------------------------------------
// Exports.
//

export { WebAlias }
