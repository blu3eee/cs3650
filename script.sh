#!/bin/bash

# install packages
npm uninstall eslint-config-next && npm i -D eslint eslint-config-{love,prettier} eslint-plugin-jsdoc husky lint-staged @commitlint/{cli,config-conventional,cz-commitlint} && npm i -D eslint-config-next

npm pkg set 'scripts.prepare'='husky'
npm pkg set 'scripts.lint'='eslint . --ext js,jsx,ts,tsx --report-unused-disable-directives --max-warnings 0'
npm pkg set 'scripts.lint:fix'='eslint . --ext js,jsx,ts,tsx --fix'
npm pkg set 'scripts.format'='prettier --config .prettierrc.json --write --ignore-unknown "**/*.{ts,tsx}"'
npm pkg set 'scripts.commit'='npx git-cz'
npm pkg set --json 'husky'='
{
    "hooks": {
        "pre-commit": "lint-staged",
        "pre-push": "npm run lint && npm run format"
    }
}
'

npm pkg set --json 'lint-staged'='
{
    "./**/*.{ts,tsx,js,jsx}": ["npm run lint", "npm run format"]
}
'

npm pkg set --json 'config'='
{
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
}
'

# Define the new content for .eslintrc.json
new_eslintrc_content=$(cat << 'EOF'
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsdoc/recommended-typescript-error",
    "plugin:@typescript-eslint/recommended",
    "love",
    "prettier"
  ],
  "overrides": [],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": [
      "./tsconfig.json"
    ]
  },
  "plugins": [
    "react",
    "react-hooks"
  ],
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": 0,
    "jsdoc/no-types": 0
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
EOF
)

# Remove the existing .eslintrc.json file if it exists
if [ -f .eslintrc.json ]; then
  rm .eslintrc.json
fi

# Write the new content to .eslintrc.json
printf '%s\n' "$new_eslintrc_content" > .eslintrc.json

## setup .prettierrc.json

new_prettierrc_content=$(cat << 'EOF'
{
 "tabWidth": 2,
  "singleQuote": false
}
EOF
)

# Remove the existing .eslintrc.json file if it exists
if [ -f .eslintrc.json ]; then
  rm .prettierrc.json
fi

# Write the new content to .eslintrc.json
printf '%s\n' "$new_prettierrc_content" > .prettierrc.json

npm run prepare

echo 'npx lint-staged' > .husky/pre-commit
echo 'npx --no-install commitlint --edit "$1"' > .husky/commit-msg