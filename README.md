# flying-star-feng-shui

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## City dataset (GeoNames)

To use the static city dataset with time zones, you need the GeoNames `cities15000.txt` file:

1. Create the directory `data/geonames` in the project root if it does not exist.
2. Download `cities15000.zip` from the official GeoNames site and extract `cities15000.txt` into `data/geonames/cities15000.txt`.
3. Generate the compact JSON dataset by running:

```bash
npm run build:cities
```

This will read `data/geonames/cities15000.txt` and produce a compact JSON array at `src/lib/data/cities.generated.json` that can be imported directly in your Next.js code.

If this file becomes very large in your project:
- Consider enabling lazy loading in the `CitySelect` component so the dataset is only fetched when the user focuses the dropdown.
- Optionally gzip the JSON at the CDN/proxy level.
- Or generate multiple JSON files split by country/region (for example `cities.us.json`, `cities.eu.json`) and load only the subsets you need via dynamic import.
