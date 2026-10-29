# TimeSlot

TimeSlot is an appointment-booking foundation for barbers, cosmetologists, stylists, and their clients.

This first version includes:

- Customer discovery and provider profiles
- Service, date, time, and confirmation booking flow
- Professional dashboard and day calendar
- Booking metrics, availability, and waitlist prompts
- Responsive desktop and mobile layouts
- A clear client/business preview switch

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## AWS Amplify

The repository includes an `amplify.yml` build specification. Amplify uses
Nitro's AWS adapter to create the SSR-compatible `.amplify-hosting` bundle,
while the default build continues to target Cloudflare/Sites.

To verify the Amplify bundle locally:

```bash
npm run build:amplify
```

The current app uses realistic demo data as a front-end template. Authentication, persistent booking data, payments, notifications, and production calendar syncing are intended for the next implementation phase.
