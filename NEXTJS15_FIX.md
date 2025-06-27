## TypeScript/Next.js 15 Compatibility Fix

### Issue Fixed
The build was failing due to Next.js 15 changes in how dynamic route parameters are handled. In Next.js 15, the `params` prop in dynamic routes is now a Promise instead of a direct object.

### Solution Applied
Changed from using the `params` prop directly to using the `useParams()` hook, which provides the parameters synchronously and is compatible with Next.js 15.

### Changes Made
**Before (Next.js 14 style):**
```tsx
interface ScanDetailsPageProps {
  params: {
    id: string;
  };
}

const ScanDetailsPage: React.FC<ScanDetailsPageProps> = ({ params }) => {
  // Direct access to params.id
}
```

**After (Next.js 15 compatible):**
```tsx
const ScanDetailsPage: React.FC = () => {
  const params = useParams();
  // Access via params.id (no async needed)
}
```

### Files Updated
- `src/app/scan-details/[id]/page.tsx`: Fixed dynamic route parameter handling

The build should now complete successfully with Next.js 15.
