# Project Shadow

This is a project from the [web3con](https://www.web3con.dev) hackathon which is an app that allows organizations to manage wallet verification and build on top of it with API keys and form validations.

![Shadow Interface](/README/shadow-interface.png "Shadow Inteface")

**NOTE** This app needs the following backend API to work with it.

[https://github.com/codingwithmanny/project-shadow-api](https://github.com/codingwithmanny/project-shadow-api)

## Requirements

- NVM or NodeJS `v16.14.0`
- Supabase Account
- Backend API - https://github.com/codingwithmanny/project-shadow-api

## Environment Variables

**File:** `.env`

```yaml
VITE_API_URL="http://localhost:5001/api"
VITE_SUPABASE_ANON_PUBLIC="YOUR_SUPABASE_ANON_PUBLIC"
VITE_SUPABASE_URL="https://YOUR_SUPABASE_URL.supabase.co"
```

## Local Setup

Install Node:

```bash
nvm install;
```

Install Dependencies:

```bash
yarn install;
```

Add your own environment variables to `.env`

Start local development

```bash
yarn dev;
```

## Contributors

- [codingwithmanny](https://github.com/codingwithmanny)
- [RazorSiM](https://github.com/RazorSiM)
