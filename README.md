# Data Marketplace

Data Marketplace is a place where everyone in Equinor can explore and get access to data. This is a simplified tool with only the most important information about a data product.

Data Marketplace is a part of the Data To The Many (DTTM) initiative.

## 🚀 Getting started

First, ensure that if you have an SSH key set up, that your SSH key has SSO configured. If not, follow [this guide](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-an-ssh-key-for-use-with-saml-single-sign-on) to configure that.

An SSH key is not required, but recommended and a lot easier to manage with SSO as opposed to HTTP remotes, which requires you to manage an access token.

1. Clone this repo
   $ git clone git@github.com:equinor/data-marketplace.git
2. Make sure you're on the correct version of Node. If you have [NVM](https://github.com/nvm-sh/nvm) installed,
   simply run `nvm use` in your terminal of choice. If you don't have NVM installed, it's highly recommended.
3. Install Node dependencies by running `npm install` in your terminal.
4. Copy `.env.template` and fill in the required values (`cp .env.template .env.local`)
5. Start up the development server by running `npm run dev`.
