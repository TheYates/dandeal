# Pre-Existing TypeScript Errors

These TypeScript errors exist in the codebase but do **not** prevent the build from succeeding. They are unrelated to the Convex migration and were present before the migration.

## Summary

| File | Error Type | Description |
|------|------------|-------------|
| `components/common/theme-provider.tsx` | TS2322 | ThemeProviderProps type mismatch |
| `components/public/RouteMap.tsx` | TS2307 | Missing react-leaflet/leaflet types |
| `components/ui/badge.tsx` | TS2322 | SlotProps type issue |
| `components/ui/button.tsx` | TS2322 | SlotProps type issue |
| `components/ui/alert-dialog.tsx` | TS2322 | SlotProps type issue |
| `components/ui/sidebar.tsx` | TS2322 | SlotProps type issues (3 occurrences) |

---

## Detailed Errors

### 1. `components/common/theme-provider.tsx`

**Line:** 11  
**Error:** TS2322  
**Message:**
```
Type '{ children: ReactNode; suppressHydrationWarning: true; themes?: string[] | undefined; forcedTheme?: string | undefined; enableSystem?: boolean | undefined; disableTransitionOnChange?: boolean | undefined; ... 6 more ...; scriptProps?: ScriptProps | undefined; }' is not assignable to type 'IntrinsicAttributes & ThemeProviderProps'.
```

**Likely Fix:** Update the `next-themes` package or adjust the props being passed to `ThemeProvider`.

---

### 2. `components/public/RouteMap.tsx`

**Lines:** 4, 5  
**Error:** TS2307  
**Messages:**
```
Cannot find module 'react-leaflet' or its corresponding type declarations.
Cannot find module 'leaflet' or its corresponding type declarations.
```

**Fix:** Install the type declarations:
```bash
bun add -D @types/leaflet
```

Or if `react-leaflet` and `leaflet` are not installed:
```bash
bun add react-leaflet leaflet
bun add -D @types/leaflet
```

---

### 3. `components/ui/badge.tsx`

**Line:** 38  
**Error:** TS2322  
**Message:**
```
Type '{ ref?: Ref<HTMLSpanElement> | undefined; key?: Key | null | undefined; ... }' is not assignable to type 'SlotProps'.
```

**Likely Fix:** This is typically a Radix UI / shadcn/ui version mismatch. Update the UI component library or regenerate the component using the latest shadcn/ui CLI.

---

### 4. `components/ui/button.tsx`

**Line:** 55  
**Error:** TS2322  
**Message:**
```
Type '{ ref?: Ref<HTMLButtonElement> | undefined; ... }' is not assignable to type 'SlotProps'.
```

**Likely Fix:** Same as badge.tsx - Radix UI / shadcn/ui version issue.

---

### 5. `components/ui/alert-dialog.tsx`

**Line:** 83  
**Error:** TS2322  
**Message:**
```
Type '{ ref?: Ref<HTMLButtonElement> | undefined; ... }' is not assignable to type 'SlotProps'.
```

**Likely Fix:** Same as badge.tsx - Radix UI / shadcn/ui version issue.

---

### 6. `components/ui/sidebar.tsx`

**Lines:** 478, 560, 683  
**Error:** TS2322  
**Messages:**
```
Type '{ ref?: Ref<HTMLButtonElement> | undefined; ... }' is not assignable to type 'SlotProps'.
Type '{ ref?: Ref<HTMLAnchorElement> | undefined; ... }' is not assignable to type 'SlotProps'.
```

**Likely Fix:** Same as above - Radix UI / shadcn/ui version issue.

---

## Recommended Fixes

### Option 1: Update shadcn/ui Components

Regenerate the affected components using the latest shadcn/ui CLI:

```bash
bunx shadcn-ui@latest add badge button alert-dialog sidebar --overwrite
```

### Option 2: Update Radix UI Packages

```bash
bun update @radix-ui/react-slot @radix-ui/react-alert-dialog
```

### Option 3: Install Missing Leaflet Types

```bash
bun add -D @types/leaflet
```

### Option 4: Suppress Errors (Not Recommended)

Add `// @ts-ignore` or `// @ts-expect-error` above the problematic lines. This is not recommended as it hides potential issues.

---

## Notes

- These errors do **not** prevent `bun run build` from succeeding
- The application functions correctly despite these type warnings
- These should be addressed as technical debt when time permits
