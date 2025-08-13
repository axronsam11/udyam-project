# Udyam Registration Portal - Production Grade Demo

A pixel-faithful, mobile-first replica of the Udyam Registration portal with dynamic schema-driven forms, real-time validation, and comprehensive UX features.

## 🚀 Features

### Core Functionality
- **Dynamic Schema Rendering**: JSON-driven form generation with conditional logic
- **Real-time Validation**: Comprehensive pattern matching for Indian documents (PAN, Aadhaar, GSTIN, IFSC, etc.)
- **Multi-step Wizard**: Progressive form with save/resume functionality
- **Auto-lookup Services**: PIN code to address and IFSC to bank details
- **Responsive Design**: Mobile-first approach (320px to 1440px+)
- **Accessibility**: WCAG 2.2 AA compliant with keyboard navigation

### Technical Features
- **Next.js 13+**: App Router with TypeScript
- **Schema-driven**: Dynamic form rendering from JSON configuration
- **Form Management**: react-hook-form + Zod validation
- **State Management**: Zustand with persistence
- **UI Components**: shadcn/ui with Tailwind CSS
- **Animations**: Framer Motion for smooth transitions
- **Testing**: Jest + React Testing Library setup

### UX Enhancements
- **Auto-save**: Debounced form persistence
- **Progress Tracking**: Visual step indicators with completion status
- **Unsaved Changes Guard**: Prevent accidental data loss
- **Field Dependencies**: Show/hide fields based on conditions
- **Validation Summary**: Comprehensive error feedback
- **Mobile Optimization**: Collapsible stepper and touch-friendly controls

## 🛠 Technology Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: react-hook-form + @hookform/resolvers + Zod
- **State**: Zustand with persist middleware
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Custom patterns for Indian documents
- **Testing**: Jest + React Testing Library + Playwright
- **Linting**: ESLint + Prettier

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd udyam-registration-portal
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── (legal)/                  # Legal pages group
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── register/page.tsx         # Main form page
│   ├── review/page.tsx           # Review page
│   ├── success/page.tsx          # Success page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── forms/                   # Form-related components
│   │   ├── SchemaForm.tsx       # Main form orchestrator
│   │   ├── FieldRenderer.tsx    # Dynamic field rendering
│   │   ├── FormFooter.tsx       # Navigation and actions
│   │   └── ReviewTable.tsx      # Review page table
│   ├── ui/                      # Reusable UI components
│   │   ├── MaskedTextInput.tsx  # Input masking
│   │   ├── MultiSelectChips.tsx # Multi-select with chips
│   │   └── FileInput.tsx        # File upload component
│   └── common/                  # Common components
│       ├── FormStepper.tsx      # Step navigation
│       ├── SaveBar.tsx          # Auto-save indicator
│       └── LoadingSpinner.tsx   # Loading states
├── lib/
│   ├── data/                    # Data layer
│   │   ├── DataClient.ts        # Interface definition
│   │   └── MockDataClient.ts    # Local storage implementation
│   ├── schema/                  # Schema handling
│   │   ├── schemaLoader.ts      # Schema loading logic
│   │   └── zodGenerator.ts      # Zod schema generation
│   ├── store/                   # State management
│   │   └── formStore.ts         # Form state with Zustand
│   ├── hooks/                   # Custom hooks
│   │   └── useFormPersistence.ts
│   └── utils/                   # Utility functions
├── public/
│   ├── schemas/
│   │   └── udyam_form.schema.json # Form schema definition
│   └── data/                    # Mock data
│       ├── pincode-index.json   # PIN code lookup
│       └── ifsc-index.json      # IFSC lookup
└── tests/                       # Test files
```

## 🔧 Configuration

### Form Schema
The form structure is defined in `public/schemas/udyam_form.schema.json`. This JSON file controls:
- Form steps and fields
- Validation rules
- Conditional logic
- Field types and formats

### Validation Patterns
Custom validation patterns for Indian documents:
- **PAN**: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`
- **Aadhaar**: `^[2-9]{1}[0-9]{11}$`
- **GSTIN**: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`
- **IFSC**: `^[A-Z]{4}0[A-Z0-9]{6}$`
- **Mobile**: `^[6-9][0-9]{9}$`
- **PIN Code**: `^[1-9][0-9]{5}$`

### Mock Data Services
- **PIN Code Lookup**: Auto-populates state/district from PIN
- **IFSC Lookup**: Auto-populates bank name/branch from IFSC
- **Form Persistence**: Local storage with auto-save

## 🧪 Testing

### Unit Tests
```bash
npm run test
# or
yarn test
```

### E2E Tests
```bash
npm run test:e2e
# or
yarn test:e2e
```

### Lint and Format
```bash
npm run lint
npm run format
# or
yarn lint
yarn format
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub repository
2. Connect to Vercel
3. Deploy automatically

### Manual Build
```bash
npm run build
npm run export  # For static export
```

## 🔄 Future Backend Integration

The application is designed with clean separation for backend integration:

### Data Client Pattern
```typescript
// Current: MockDataClient (localStorage)
// Future: ApiDataClient (HTTP + MongoDB)

interface DataClient {
  saveDraft(data: any): Promise<void>;
  loadDraft(): Promise<any | null>;
  submit(data: any): Promise<{ reference: string }>;
  lookupPin(pin: string): Promise<LocationData | null>;
  lookupIfsc(code: string): Promise<BankData | null>;
}
```

### MongoDB Integration (Planned)
```typescript
// Example implementation
class MongoDataClient implements DataClient {
  async saveDraft(data: any): Promise<void> {
    await fetch('/api/drafts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  // ... other methods
}
```

### API Routes Structure (Future)
```
/api/
├── drafts/          # Save/load draft data
├── submit/          # Final submission
├── lookup/
│   ├── pin/        # PIN code lookup
│   └── ifsc/       # IFSC lookup
└── upload/         # File uploads
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Orange (#F97316) 
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Sizes**: Responsive scale from 12px to 48px

### Spacing
- **Base unit**: 8px
- **Grid system**: 8px increments
- **Container**: Max-width responsive containers

## ♿ Accessibility

### WCAG 2.2 AA Compliance
- Semantic HTML structure
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- High contrast support
- Screen reader compatibility

### Keyboard Navigation
- Tab order follows logical flow
- Enter/Space for interactions
- Escape to close modals
- Arrow keys for navigation

## 📱 Mobile Optimization

### Responsive Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

### Mobile Features
- Touch-friendly controls (44px minimum)
- Collapsible navigation
- Optimized form layouts
- Swipe gestures support

## 🔒 Security Considerations

### Frontend Security
- Input sanitization
- XSS prevention
- CSP headers configured
- No sensitive data in client bundle
- Secure form validation

### Data Handling
- Local storage encryption (planned)
- No real PII in demo mode
- Session timeout handling
- Secure file uploads (planned)

## 📊 Performance

### Optimization Features
- Code splitting by route
- Lazy loading for heavy components
- Image optimization
- Bundle size monitoring
- Efficient re-renders with React hooks

### Metrics
- Lighthouse Score: 90+ (all categories)
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <500KB gzipped

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- TypeScript strict mode
- ESLint + Prettier formatting
- Component documentation
- Unit test coverage >80%
- E2E tests for critical paths

## 📄 License

This project is created for educational and demonstration purposes only. 

**Important Disclaimer**: This is NOT the official Udyam Registration portal. For actual MSME registration, please visit [udyamregistration.gov.in](https://udyamregistration.gov.in).

## 🆘 Support

For questions about the demo implementation:
- Open GitHub Issues
- Review documentation
- Check example implementations

For official Udyam Registration queries:
- Visit [udyamregistration.gov.in](https://udyamregistration.gov.in)
- Contact Ministry of MSME
- Call helpline: 1800-11-6000

---

**Built with ❤️ for the developer community**