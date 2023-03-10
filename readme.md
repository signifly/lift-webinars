## LIFT AARP

This repo is for one JavaScript file that is used on the LIFT AARP WebFlow site. We're using this repo to avoid going over the maximum allowed lines of custom code in WebFlow.

### How to use

Update the index.js file with the code you need and take the id of the latest commit and append to the the script import in WebFlow.

For example, if the latest commit is 8c3acd339b81288814125713c12dd8554d4d77cb, then the script import should look like this:

`<script src="https://cdn.jsdelivr.net/gh/signifly/lift-webinars@8c3acd339b81288814125713c12dd8554d4d77cb/index.js"></script>`
