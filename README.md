## Getting started

First, ensure that if you have an SSH key set up, that your SSH key has SSO configured. If not, follow [this guide](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-an-ssh-key-for-use-with-saml-single-sign-on) to configure that.

An SSH key is not required, but recommended and a lot easier to manage with SSO as opposed to HTTP remotes, which requires you to manage an access token.

1. Fork this repository.
2. Clone your forked repository.
3. Add an additional remote to **this** upstream repository. You'll use this remote to sync your own fork with the team's contributions.
  - Do this by running `git remote add upstream git@github.com:equinor/data-marketplace.git`.
  - If you now run `git remote --verbose` you should see both an `origin` and an `upstream` remote.
4. Install Node dependencies by running `npm install` in your terminal.
5. Start up the development server by running `npm run dev`.
