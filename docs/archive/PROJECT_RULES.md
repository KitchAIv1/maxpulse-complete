# PROJECT RULES - MAXPULSE Platform

## 📋 Core Development Guidelines

These rules must be strictly followed for all code in this project. No exceptions.

### File Length and Structure
- **Never allow a file to exceed 500 lines.**
- **If a file approaches 400 lines, break it up immediately.**
- **Treat 1000 lines as unacceptable, even temporarily.**
- Use folders and naming conventions to keep small files logically grouped.

### OOP First (Adapted for React/TypeScript)
- Every functionality should be in a dedicated class, custom hook, or service, even if it's small.
- Favor composition over inheritance, but always use object-oriented thinking.
- Code must be built for reuse, not just to "make it work."
- Use TypeScript interfaces and classes for data structures and business logic.

### Single Responsibility Principle
- **Every file, class, and function should do one thing only.**
- **If it has multiple responsibilities, split it immediately.**
- Each component, hook, or utility should be laser-focused on one concern.

### Modular Design
- Code should connect like Lego – interchangeable, testable, and isolated.
- Ask: "Can I reuse this component/hook in a different screen or project?" If not, refactor it.
- Reduce tight coupling between components. Favor props, context, or dependency injection.

### Manager and Coordinator Patterns (React Adaptation)
- Use clear naming conventions for logic separation:
  - **UI logic** → Custom Hooks (`useAssessment`, `useTracking`)
  - **Business logic** → Services/Managers (`AssessmentManager`, `CommissionService`)
  - **State management** → Context Providers (`AssessmentProvider`, `UserProvider`)
  - **Navigation/routing** → Router components and navigation hooks
- **Never mix UI components and business logic directly.**

### Function and Component Size
- **Keep functions under 30-40 lines.**
- **Keep React components under 200 lines.**
- If a component exceeds 200 lines, split into smaller sub-components.
- Extract complex logic into custom hooks or utility functions.

### Naming and Readability
- **All component, function, and variable names must be descriptive and intention-revealing.**
- Avoid vague names like `data`, `info`, `helper`, or `temp`.
- Use PascalCase for components, camelCase for functions/variables.
- Use descriptive file names that match component/function purpose.

### Scalability Mindset
- **Always code as if someone else will scale this.**
- Include extension points (TypeScript interfaces, generic components) from day one.
- Design for future features and integrations.
- Write code that can handle 10x current usage.

### Avoid God Components/Files
- **Never let one file or component hold everything.**
- Split large components into:
  - **UI Components** (presentation)
  - **Container Components** (logic)
  - **Custom Hooks** (state management)
  - **Services** (business logic)
  - **Utils** (pure functions)

## 🚨 IMMEDIATE VIOLATIONS TO FIX

### Critical Issues Identified:

1. **`assessment/src/App.tsx` - 935 LINES** 🚨
   - **VIOLATION**: Exceeds 500-line limit by 435 lines
   - **ACTION REQUIRED**: Split immediately into:
     - `AppProvider.tsx` (context management)
     - `AssessmentFlow.tsx` (question logic)
     - `ResultsManager.tsx` (results handling)
     - `TrackingManager.tsx` (analytics)

2. **`assessment/src/components/QuestionCard.tsx` - 549 LINES** 🚨
   - **VIOLATION**: Exceeds 500-line limit
   - **ACTION REQUIRED**: Split into:
     - `QuestionCard.tsx` (main component)
     - `QuestionOptions.tsx` (options rendering)
     - `QuestionValidation.tsx` (validation logic)
     - `useQuestionState.tsx` (custom hook)

3. **Multiple Components Approaching Limit**:
   - Review all files >300 lines for immediate refactoring

## 🎯 IMPLEMENTATION STRATEGY

### Phase 1: Critical Fixes (Week 1)
1. Split `App.tsx` into 4 smaller components
2. Refactor `QuestionCard.tsx` 
3. Create service classes for business logic

### Phase 2: Architecture Improvement (Week 2-3)
1. Implement Manager pattern for:
   - `AssessmentManager` (business logic)
   - `CommissionManager` (commission calculations)
   - `TrackingManager` (analytics)
2. Create custom hooks for state management
3. Implement proper separation of concerns

### Phase 3: Scalability (Week 4)
1. Add dependency injection patterns
2. Create reusable component library
3. Implement proper error boundaries

## 🔧 ENFORCEMENT

- **All new code must follow these rules**
- **No PR should be merged with rule violations**
- **Regular code reviews to ensure compliance**
- **Automated linting rules where possible**

## 📊 SUCCESS METRICS

- No files >500 lines
- No components >200 lines
- No functions >40 lines
- Clear separation of concerns
- High component reusability
- Maintainable codebase

---

**These rules are non-negotiable and must be followed by all developers working on this project.**
