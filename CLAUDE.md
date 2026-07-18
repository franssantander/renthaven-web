# RentHaven Web — Claude Code Guidelines

## Project Overview

RentHaven is a rental management SaaS application for landlords and property management teams.

The frontend is built with Next.js and communicates with a Laravel 13 REST API backend.

The application supports the following roles:

* Super Admin
* Admin / Landlord
* Staff
* Tenant / Renter

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Geist Font
* TanStack Query
* Axios
* React Hook Form
* Zod
* Zustand

## Backend

* Laravel 13
* Laravel Passport
* REST API
* Stateless token-based authentication

## Database

The frontend must never communicate directly with the database.

All application data must be accessed through the Laravel REST API.

---

# Authentication Architecture

RentHaven uses Laravel Passport with stateless authentication.

The frontend does not receive an access token directly in the login response.

The authentication token is handled through an HTTP-only cookie.

The browser automatically sends the cookie with authenticated requests.

The frontend should never manually store authentication tokens in:

* localStorage
* sessionStorage
* Zustand
* React Context
* JavaScript-accessible cookies

The frontend must not directly access the authentication token.

---

# Authentication Flow

User
  ↓
Next.js Login Form
  ↓
Auth Service
  ↓
Auth API
  ↓
Axios Client
  ↓
Laravel Passport
  ↓
Authentication Success
  ↓
HTTP-only Cookie
  ↓
Browser Stores Cookie


For subsequent requests:

Next.js Request
      ↓
Axios Client
      ↓
Browser Automatically Sends HTTP-only Cookie
      ↓
Laravel Passport
      ↓
Authenticated API Request


The frontend should not do this:


localStorage.setItem("token", token);


The frontend should not do this:


useAuthStore.setState({
  token,
});


The frontend should not manually attach:


Authorization: `Bearer ${token}`


because the token is not exposed to frontend JavaScript.

---

# Axios Configuration

Axios is the primary HTTP client.

The Axios client is responsible for:

* API base URL
* Sending cookies
* Request configuration
* Response handling
* Centralized error handling

Recommended structure:


src/
└── lib/
    └── axios/
        ├── client.ts
        ├── interceptors.ts
        └── index.ts


---

# Axios Client


src/lib/axios/client.ts



import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


The most important configuration is:


withCredentials: true


This allows the browser to send HTTP-only cookies with requests.

---

# Axios Interceptors

Interceptors should handle common API behavior.

Example:


src/lib/axios/interceptors.ts



import { axiosClient } from "./client";

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthenticated state
    }

    return Promise.reject(error);
  }
);


The Axios client should not contain feature-specific business logic.

Avoid putting property, tenant, payment, or ledger logic inside Axios interceptors.

---

# Authentication API

Authentication endpoints should be located within the authentication feature.


src/
└── features/
    └── auth/
        ├── api/
        │   └── auth-api.ts
        ├── components/
        ├── hooks/
        ├── schemas/
        └── types/


Example:


src/features/auth/api/auth-api.ts



import { axiosClient } from "@/lib/axios/client";

export const authApi = {
  login(data: LoginInput) {
    return axiosClient.post("/auth/login", data);
  },

  logout() {
    return axiosClient.post("/auth/logout");
  },

  getCurrentUser() {
    return axiosClient.get("/auth/me");
  },
};


The login response does not need to return a token to the frontend.

Example:


POST /auth/login
        ↓
Laravel Passport authenticates user
        ↓
HTTP-only authentication cookie is created
        ↓
Response returns user/session information


---

# Authentication Service

Business logic related to authentication belongs in the service layer.


src/services/auth/auth-service.ts



import { authApi } from "@/features/auth/api/auth-api";

export const authService = {
  async login(credentials: LoginInput) {
    const response = await authApi.login(credentials);

    return response.data;
  },

  async logout() {
    await authApi.logout();
  },

  async getCurrentUser() {
    const response = await authApi.getCurrentUser();

    return response.data;
  },
};


The authentication service should not expose or manually manage the Passport token.

---

# Authentication State

The frontend should represent authentication state using the current user/session.

Example:


Authenticated
    ↓
GET /auth/me
    ↓
Laravel checks HTTP-only cookie
    ↓
Returns current user


The frontend can determine the authentication state from:


Current User
    ↓
Authenticated

No Current User
    ↓
Unauthenticated


Do not use the token itself to determine authentication state.

---

# Current User Query

TanStack Query should manage the current authenticated user.

Example:


src/features/auth/hooks/use-current-user.ts



"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth-service";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: authService.getCurrentUser,
    retry: false,
  });
}


Authentication flow:


Application Loads
        ↓
useCurrentUser()
        ↓
GET /auth/me
        ↓
Cookie Automatically Sent
        ↓
Laravel Passport
        ↓
User Returned


---

# Authentication State Diagram


Application Starts
        ↓
Checking Session
        ↓
GET /auth/me
        │
        ├── 200
        │    ↓
        │  Authenticated
        │
        └── 401
             ↓
           Guest


The frontend should avoid manually assuming the user is authenticated after login.

Instead:


Login Success
      ↓
Invalidate Current User Query
      ↓
Fetch Current User
      ↓
Update Application


Example:


await authService.login(credentials);

await queryClient.invalidateQueries({
  queryKey: ["current-user"],
});


---

# Application Architecture

RentHaven follows a feature-oriented architecture with a service layer.

The primary application flow is:


Next.js Route
      ↓
Feature Component
      ↓
Feature Hook
      ↓
Service Layer
      ↓
Feature API
      ↓
Axios Client
      ↓
Laravel REST API


Example:


app/(dashboard)/properties/page.tsx
      ↓
features/properties/components/properties-view.tsx
      ↓
features/properties/hooks/use-properties.ts
      ↓
services/properties/property-service.ts
      ↓
features/properties/api/property-api.ts
      ↓
lib/axios/client.ts
      ↓
Laravel API


---

# Project Structure


renthaven-web/
├── src/
│   ├── app/
│   ├── features/
│   ├── components/
│   ├── services/
│   ├── stores/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   └── config/
│
├── public/
├── components.json
├── package.json
├── tsconfig.json
├── next.config.ts
└── Dockerfile


---

# `src/app`

The `app` directory contains Next.js routes and route-level composition.

Example:


src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── magic-link/
│       └── page.tsx
│
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── ledger/
│   │   └── page.tsx
│   ├── payments/
│   │   └── page.tsx
│   ├── properties/
│   │   └── page.tsx
│   ├── tenants/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── tenant/
│   └── dashboard/
│       └── page.tsx
│
├── super-admin/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── landlords/
│   │   └── page.tsx
│   └── subscriptions/
│       └── page.tsx
│
├── layout.tsx
├── page.tsx
└── globals.css


Routes should remain thin.

Example:

x
import { PropertiesView } from "@/features/properties/components/properties-view";

export default function PropertiesPage() {
  return <PropertiesView />;
}


Do not put complex business logic inside route files.

---

# `src/features`

Features contain domain-specific UI functionality.


src/features/
├── auth/
├── dashboard/
├── ledger/
├── payments/
├── properties/
├── tenants/
└── users/


A feature can contain:


feature/
├── api/
├── components/
├── hooks/
├── schemas/
├── types/
└── constants/


Only create directories when they are needed.

---

# Example: Properties Feature


src/features/properties/
├── api/
│   └── property-api.ts
│
├── components/
│   ├── properties-view.tsx
│   ├── properties-header.tsx
│   ├── properties-table.tsx
│   ├── property-card.tsx
│   ├── property-form.tsx
│   ├── property-dialog.tsx
│   │
│   └── units/
│       ├── units-view.tsx
│       ├── units-table.tsx
│       ├── unit-form.tsx
│       └── unit-dialog.tsx
│
├── hooks/
│   ├── use-properties.ts
│   └── use-units.ts
│
├── schemas/
│   ├── property-schema.ts
│   └── unit-schema.ts
│
├── types/
│   ├── property.types.ts
│   └── unit.types.ts
│
└── constants/
    └── property.constants.ts


---

# Feature API Layer

Feature API modules define communication with Laravel endpoints.

Example:


src/features/properties/api/property-api.ts



import { axiosClient } from "@/lib/axios/client";
import type {
  CreatePropertyInput,
  Property,
} from "../types/property.types";

export const propertyApi = {
  getAll() {
    return axiosClient.get<Property[]>("/properties");
  },

  getById(id: number) {
    return axiosClient.get<Property>(`/properties/${id}`);
  },

  create(data: CreatePropertyInput) {
    return axiosClient.post<Property>("/properties", data);
  },

  update(id: number, data: Partial<CreatePropertyInput>) {
    return axiosClient.put<Property>(`/properties/${id}`, data);
  },

  delete(id: number) {
    return axiosClient.delete(`/properties/${id}`);
  },
};


The API layer should focus on:

* Endpoint paths
* HTTP methods
* Request payloads
* Response types

The API layer should not contain complex business rules.

---

# Service Layer

The service layer contains application business logic.


src/services/
├── auth/
│   └── auth-service.ts
├── dashboard/
│   └── dashboard-service.ts
├── ledger/
│   └── ledger-service.ts
├── payments/
│   └── payment-service.ts
├── properties/
│   └── property-service.ts
├── tenants/
│   └── tenant-service.ts
└── users/
    └── user-service.ts


The service layer is responsible for:

* Business operations
* Coordinating multiple API calls
* Transforming data
* Preparing data for the UI
* Application-level workflows

Example:


Property Component
        ↓
Property Hook
        ↓
Property Service
        ↓
Property API
        ↓
Axios Client
        ↓
Laravel


---

# Property Service Example


src/services/properties/property-service.ts



import { propertyApi } from "@/features/properties/api/property-api";

export const propertyService = {
  async getProperties() {
    const response = await propertyApi.getAll();

    return response.data;
  },

  async getProperty(id: number) {
    const response = await propertyApi.getById(id);

    return response.data;
  },

  async createProperty(data: CreatePropertyInput) {
    const response = await propertyApi.create(data);

    return response.data;
  },
};


The service layer should hide Axios response details from the rest of the application.

Instead of returning:


AxiosResponse<Property[]>


the service should normally return:


Property[]


This keeps the rest of the application independent from Axios.

---

# Business Logic in Services

Business logic should be handled by services when it involves application workflows.

Example:


export const paymentService = {
  async approvePayment(paymentId: number) {
    const response = await paymentApi.approve(paymentId);

    return response.data;
  },
};


More complex example:


export const paymentService = {
  async approvePayment(paymentId: number) {
    const payment = await paymentApi.getById(paymentId);

    if (payment.data.status !== "pending") {
      throw new Error("Only pending payments can be approved");
    }

    const response = await paymentApi.approve(paymentId);

    return response.data;
  },
};


However, important business rules must still be enforced by Laravel.

Frontend business logic improves the user experience.

Backend business logic provides the actual security and authority.

---

# Feature Hooks

Hooks connect React components to services and TanStack Query.

Example:


src/features/properties/hooks/use-properties.ts



"use client";

import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/properties/property-service";

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: propertyService.getProperties,
  });
}


The hook should primarily handle:

* TanStack Query
* Query keys
* Loading state
* Error state
* Cache invalidation

The hook should not contain large business workflows.

---

# TanStack Query

TanStack Query manages server state.

Use it for:

* Properties
* Units
* Tenants
* Payments
* Ledger
* Users
* Dashboard data
* Current authenticated user

Example:


useQuery
    ↓
Read server data

useMutation
    ↓
Create or modify server data


Do not duplicate server state into Zustand.

---

# Mutations

Example:


export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyService.createProperty,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });
    },
  });
}


The flow is:


Form
  ↓
Mutation Hook
  ↓
Service
  ↓
API
  ↓
Axios
  ↓
Laravel
  ↓
Success
  ↓
Invalidate Query
  ↓
Refresh Data


---

# Zustand

Zustand manages global client-side state.

Recommended use cases:

* Sidebar open/collapsed state
* Mobile navigation
* Global UI preferences
* Complex client-side filters
* Multi-step client-side workflows

Example:


src/stores/layout-store.ts



import { create } from "zustand";

type LayoutState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarOpen: true,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  setSidebarOpen: (isOpen) =>
    set({
      isSidebarOpen: isOpen,
    }),
}));


Do not use Zustand for:


Properties
Tenants
Payments
Ledger
Users


when these are already managed by TanStack Query.

---

# Forms

Use React Hook Form for forms.

Use Zod for validation.

Example:


src/features/properties/schemas/property-schema.ts



import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;


Use this approach for:

* Login
* Property forms
* Unit forms
* Tenant forms
* Payment forms
* Staff forms

---

# Role-Based Access

The application has four roles:


Super Admin
    ↓
Admin / Landlord
    ↓
Staff
    ↓
Tenant


The frontend may hide or show UI based on permissions.

However, frontend authorization is not security.

The Laravel backend must always enforce:

* Authentication
* Role authorization
* Permission checks
* Resource ownership
* Tenant access restrictions

Frontend:


Hide unavailable UI


Backend:


Actually prevent unauthorized access


---

# API Error Handling

Axios errors should be handled consistently.

Common statuses:


401
Unauthenticated

403
Unauthorized

404
Resource not found

422
Validation error

429
Too many requests

500
Server error


The application should provide consistent handling for these errors.

For example:


401
    ↓
Clear current user state
    ↓
Redirect to login

403
    ↓
Show permission error

422
    ↓
Display validation errors

500
    ↓
Display general error state


---

# Components

## UI Components


src/components/ui/


Contains shadcn/ui components.

Examples:


button.tsx
dialog.tsx
input.tsx
table.tsx
dropdown-menu.tsx


These components should remain generic.

---

## Layout Components


src/components/layout/


Contains:


sidebar.tsx
dashboard-header.tsx
dashboard-layout.tsx
mobile-sidebar.tsx
user-menu.tsx


Global layout state should be managed by Zustand when necessary.

---

## Shared Components


src/components/shared/


Contains reusable application components:


site-header.tsx
site-footer.tsx
page-header.tsx
loading-state.tsx
empty-state.tsx
error-state.tsx


---

# Landing Page

The landing page should be composed from reusable sections.


src/features/landing/
└── components/
    ├── hero-section.tsx
    ├── features-section.tsx
    ├── how-it-works-section.tsx
    ├── pricing-section.tsx
    └── cta-section.tsx


Example:

x
import { SiteHeader } from "@/components/shared/site-header";
import { HeroSection } from "@/features/landing/components/hero-section";
import { FeaturesSection } from "@/features/landing/components/features-section";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
    </>
  );
}


---

# Complete Architecture

The complete architecture is:


┌──────────────────────────────┐
│        Next.js Route          │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│       Feature Component      │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│        Feature Hook          │
│      TanStack Query          │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│        Service Layer         │
│      Business Operations     │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│         Feature API          │
│       Endpoint Definitions   │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│        Axios Client          │
│ Base URL + Cookies + Errors  │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│        Laravel 13 API        │
│ Laravel Passport             │
│ Authorization                │
│ Business Rules               │
│ Database                     │
└──────────────────────────────┘


---

# Layer Responsibilities

## Route

Responsible for:

* Routing
* Page composition

---

## Component

Responsible for:

* Rendering UI
* User interactions
* Visual presentation

---

## Hook

Responsible for:

* React integration
* TanStack Query
* Query and mutation state

---

## Service

Responsible for:

* Application business logic
* Workflows
* Data transformations
* Coordinating API calls

---

## API

Responsible for:

* Backend endpoint definitions
* HTTP methods
* Request payloads
* Response types

---

## Axios Client

Responsible for:

* Base URL
* HTTP requests
* Cookies
* Headers
* Common error handling
* Interceptors

The Axios client must not contain domain-specific business logic.

---

## Laravel API

Responsible for:

* Authentication
* Authorization
* Roles
* Permissions
* Validation
* Business rules
* Database persistence

---

# Naming Conventions

Use kebab-case for filenames:


property-form.tsx
property-service.ts
property-api.ts
use-properties.ts
layout-store.ts


Use PascalCase for React components:


export function PropertyForm() {}


Use camelCase for functions:


getProperties()
createProperty()
approvePayment()


Use descriptive TypeScript types:


Property
CreatePropertyInput
UpdatePropertyInput
PropertyStatus


---

# Architectural Rules

## Rule 1: Keep Routes Thin

Routes should compose features.

---

## Rule 2: Keep UI Logic in Components

Components should focus on rendering and interaction.

---

## Rule 3: Keep React Integration in Hooks

Hooks should connect components to TanStack Query and services.

---

## Rule 4: Keep Business Logic in Services

Services should handle application-level business operations.

---

## Rule 5: Keep HTTP Logic in API Modules

API modules should define backend communication.

---

## Rule 6: Keep HTTP Infrastructure in Axios

Axios handles:

* Base URL
* Cookies
* Headers
* Interceptors
* Common HTTP errors

---

## Rule 7: Never Expose Passport Tokens

Do not store tokens in:

* localStorage
* sessionStorage
* Zustand
* React Context
* JavaScript-readable cookies

Authentication should use the HTTP-only cookie managed by the authentication flow.

---

## Rule 8: Keep Server State in TanStack Query

Do not duplicate server state in Zustand.

---

## Rule 9: Backend Authorization Is the Source of Truth

The frontend may hide UI.

Laravel must enforce authorization.

---

## Rule 10: Avoid Overengineering

This is an MVP.

Do not create unnecessary layers such as:


repositories/
entities/
use-cases/
domain/
factories/


unless the application genuinely requires them.

The recommended architecture is:


Feature
├── API
├── Components
├── Hooks
├── Schemas
└── Types

Services
└── Business Logic

Lib
└── Infrastructure


---

# Development Priority

Build the application in this order:

text
1. Landing Page
        ↓
2. Authentication
        ↓
3. Dashboard Layout
        ↓
4. Admin Dashboard
        ↓
5. Properties and Units
        ↓
6. Tenants
        ↓
7. Payments
        ↓
8. Ledger
        ↓
9. Staff Permissions
        ↓
10. Super Admin Features


The initial development milestone is the public landing page.

The landing page should include:

* Navigation
* Hero section
* Product value proposition
* Core features
* How RentHaven works
* Call-to-action
* Footer

---

# Final Architecture Principle

The preferred architecture is:

text
Route
  ↓
Feature Component
  ↓
Feature Hook
  ↓
Service Layer
  ↓
Feature API
  ↓
Axios Client
  ↓
Laravel Passport API


The frontend does not manage Passport tokens directly.

Authentication is handled through HTTP-only cookies.

The frontend determines the current authentication state by querying the authenticated user/session endpoint.

Keep the architecture modular, explicit, and simple enough for an MVP.

Prefer clear code over unnecessary abstraction.
