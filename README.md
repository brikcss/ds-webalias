# DirectScale WebAlias Replication Plugin

<!-- Shields. -->
<p>
    <!-- NPM version. -->
    <a href="https://www.npmjs.com/package/@brikcss/ds-webalias"><img alt="NPM version" src="https://img.shields.io/npm/v/@brikcss/ds-webalias.svg?style=flat-square"></a>
    <!-- NPM tag version. -->
    <a href="https://www.npmjs.com/package/@brikcss/ds-webalias"><img alt="NPM version" src="https://img.shields.io/npm/v/@brikcss/ds-webalias/next.svg?style=flat-square"></a>
    <!-- NPM downloads/month. -->
    <a href="https://www.npmjs.com/package/@brikcss/ds-webalias"><img alt="NPM downloads per month" src="https://img.shields.io/npm/dm/@brikcss/ds-webalias.svg?style=flat-square"></a>
    <!-- Travis branch. -->
    <a href="https://github.com/brikcss/ds-webalias/tree/master"><img alt="Travis branch" src="https://img.shields.io/travis/rust-lang/rust/master.svg?style=flat-square&label=master"></a>
    <!-- Codacy. -->
    <!-- <a href="https://www.codacy.com"><img alt="Codacy code quality" src="https://img.shields.io/codacy/grade//master.svg?style=flat-square"></a> -->
    <!-- <a href="https://www.codacy.com"><img alt="Codacy code coverage" src="https://img.shields.io/codacy/coverage//master.svg?style=flat-square"></a> -->
    <!-- Coveralls -->
    <!-- <a href='https://coveralls.io/github/brikcss/ds-webalias?branch=master'><img src='https://img.shields.io/coveralls/github/brikcss/ds-webalias/master.svg?style=flat-square' alt='Coverage Status' /></a> -->
    <!-- JS Standard style. -->
    <a href="https://standardjs.com"><img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square"></a>
    <!-- Prettier code style. -->
    <a href="https://prettier.io/"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>
    <!-- Semantic release. -->
    <!-- <a href="https://github.com/semantic-release/semantic-release"><img alt="semantic release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square"></a> -->
    <!-- Commitizen friendly. -->
    <a href="http://commitizen.github.io/cz-cli/"><img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square"></a>
    <!-- Greenkeeper. -->
    <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/brikcss/ds-webalias.svg?style=flat-square" alt="Greenkeeper badge"></a>
    <!-- MIT License. -->
    <a href="LICENSE.md"><img alt="License" src="https://img.shields.io/npm/l/express.svg?style=flat-square"></a>
</p>

## About

<strong>\[ IMPORTANT \]: Brikcss follows semantic versioning. Since this package is currently at major version zero, <a href="https://semver.org/#spec-item-4" target="_blank">"anything may change at any time", and it "should not be considered stable"</a>.</strong>

This webalias module connects with the DirectScale, Inc. webalias API to help turn any website into a replicated solution. The plugin can either check the URL to auto-detect the webalias and client/company, or they can be manually configured.

This solution is built on [Brikcss Element](https://github.com/brikcss/element), a native Web Components library.

## Contributing

We ❤️❤️❤️ contributions of any kind, whether it's bug reports, questions or feature requests, pull requests, and especially spreading some love about this project to your friends and co-workers!

**[Read our contributing guidelines](./CONTRIBUTING.md) and get involved to support this project.**

## Browser Support\*

| Chrome | Firefox | Safari | Edge | IE     |
| ------ | ------- | ------ | ---- | ------ |
| ✓      | ✓       | ✓      | ✓    | 11\*\* |

\*_With the [proper polyfills](#getting-started)._<br>
\*\*_IE11 can be supported with a transpiled build for legacy browsers._

## Install

**From NPM:**

```bash
npm install -D @brikcss/ds-webalias
```

**From GitHub:**

Download the [latest release](https://github.com/brikcss/ds-webalias/releases/latest).

_Note: File paths are written for NPM installs. If you use the GitHub release, make sure to remove `node_modules/@brikcss/ds-webalias` from any file paths._

## Quick Start

Build your component in less than 5 minutes:

1. [Include Web Components polyfills](https://github.com/brikcss/element/blob/master/docs/web-components-polyfills.md).

2. Include the ESM Browser bundle and define your element:

    ```js
    // app.js
    import { WebAlias } from 'node_modules/@brikcss/ds-webalias/dist/esm/webalias.browser.js';
    WebAlias.define('my-element');
    // or window.customElements.define('my-element', WebAlias)
    ```

3. Use your element:

    _in HTML:_

    ```html
    <!-- index.html -->
    <my-element prop="name" before="Hello, " after="!"></my-element>
    ```

    If the webalias user's name is "John Doe", the UI will display _"Hello, John Doe!"_.

    _in JS:_

    ```js
    console.log(WebAlias.user.name); // John Doe
    ```

4. Tada! Check out [the examples](./examples) if you run into issues.

    _Important: While the Browser ESM bundle works great for rapid development and prototyping, or if you only need to support modern browsers. For greater browser support, once your app is ready for production, replace the Browser ESM with [the Vanilla ESM (or UMD bundle)](https://github.com/brikcss/element/blob/master/docs/including-brikcss-modules.md)._

## API

### `WebAlias.webalias`

_Type: `String` Default: `undefined` **(required)**_

The webalias passed to the webalias API. This -- along with the `WebAlias.client` and `WebAlias.env` properties -- will return the [webalias user](#webaliasuser).

### `WebAlias.client`

_Type: `String` Default: `undefined` **(required)**_

The client ID passed to the webalias API.

### `WebAlias.env`

_Type: `String` Default: `undefined` **(required)**_

Environment to use. Can be `dev`, `stage`, or `''` (live). This determines which database is checked.

### `WebAlias.urlCheck`

_Type: `String[]|Boolean` Default: `['webalias']`_

This value determines if and how WebAlias will automatically pull data from the URL. This is a String Array, with possible values of `webalias`, `client`, and `env`. For each property listed, WebAlias will automatically fetch that data property from the URL. By default, only the `webalias` property is checked for. Setting this value to `true` will check all three properties.

_Note: For each property listed, WebAlias calls `WebAlias[`get\${propertyName}FromUrl`](host)`. This means, if you want to customize how WebAlias gets each piece of data, simply override the corresponding method. For example, to override how WebAlias gets the `webalias` property from the URL:_

```js
WebAlias.getWebaliasFromUrl = function (host) {...}
```

### `WebAlias.user`

_Type: `Object` Default: `undefined`_

The webalias user data. The `WebAlias.webalias`, `WebAlias.client`, and `WebAlias.env` properties are used to fetch webalias data from DirectScale's replicated site webalias API, and then normalizing it as follows:

-   `first` _{String}_: First name.
-   `last` _{String}_: Last name.
-   `name` _{String}_: First and last name.
-   `email` _{String}_: Email address.
-   `phone` _{String}_: Alias for `phone1`.
-   `phone1` _{String}_: Phone 1.
-   `phone2` _{String}_: Phone 2.
-   `city` _{String}_: City.
-   `state` _{String}_: State.
-   `country` _{String}_: Country.
-   `about` _{String}_: About the user.
-   `company` _{String}_: Company.
-   `language` _{String}_: Language.
-   `imageUrl` _{String}_: URL for user's profile image.
-   `image` _{String}_: User's profile `<img />`.
-   `imageData` _{String}_: Image data.
-   `facebook` _{String}_: Facebook handle.
-   `facebookLink` _{String}_: Facebook anchor tag hyperlink.
-   `twitter` _{String}_: Twitter handle.
-   `twitterLink` _{String}_: Twitter anchor tag hyperlink.
-   `pinterest` _{String}_: Pinterest handle.
-   `pinterestLink` _{String}_: Pinterest anchor tag hyperlink.
-   `youTube` _{String}_: YouTube handle.
-   `youTubeLink` _{String}_: YouTube anchor tag hyperlink.
-   `linkedIn` _{String}_: LinkedIn handle.
-   `linkedInLink` _{String}_: LinkedIn anchor tag hyperlink.
-   `enrollmentUrl` _{String}_: URL to user's enrollment site.
-   `enrollmentLink` _{String}_: Enrollment anchor tag hyperlink.
-   `officeUrl` _{String}_: URL to user's back office.
-   `officeLink` _{String}_: Back office anchor tag hyperlink.
-   `shoppingUrl` _{String}_: URL to user's shopping site.
-   `shoppingLink` _{String}_: Shopping cart anchor tag hyperlink.
-   `replicatedSiteUrl` _{String}_: URL to user's replicated site.
-   `replicatedSiteLink` _{String}_: Replicated/marketing site anchor tag hyperlink.
-   `webalias` _{String}_: User's webalias.
-   `customerId` _{String}_: User's customer ID.
-   `backOfficeId` _{String}_: User's back office ID.
-   `customerTypeId` _{String}_: User's customer type ID.
-   `status` _{String}_: User status.

#### Creating or modifying webalias properties

You can modify any of these webalias properties, or create your own by doing the following:

```js
// Create a custom webalias property.
WebAlias.propsMap.customProp = function() {
    return `Custom property for ${this.user.name()}!`;
};
// Modify an existing webalias property.
WebAlias.propsMap.name = function() {
    return `${this.user.last}, ${this.user.first}`;
};
```

These are used in the markup as usual:

```html
<web-alias prop="customProp"></web-alias>
```

which, for the user "John Doe", will display the following in the UI:

```html
Custom property for Doe, John!
```

### `WebAlias.sourceUrl`

_Type: `String|Function` Default: `https://${WebAlias.webalias}.${WebAlias.client}.directscale${WebAlias.env}.com`_

Passed in the headers (as the `ApplicationUrl` parameter) to the webalias API.

## License

[See License](LICENSE.md).
