# Brika

**Brika** is a modern architectural project management and visualization platform built to simplify how architects, designers, and project teams manage architectural projects, CAD files, collaboration, and 3D visualization.

The frontend provides a polished cross-platform experience for creating and managing projects, uploading architectural files, collaborating with project members, monitoring CAD processing and 3D generation, and interacting with generated architectural models.

---

## Overview

Brika is designed around the modern architectural workflow, bringing project management, file management, collaboration, and CAD-to-3D visualization into a single platform.

The frontend focuses on providing a clean, premium, and intuitive experience while establishing a scalable foundation for the broader Brika ecosystem.

### Core Capabilities

- Architectural project management
- Project dashboards and activity
- CAD file uploads and management
- Support for DWG, DXF, STEP, STP, STL, and PDF files
- Team collaboration and project members
- Role-based project access
- File processing status
- CAD-to-3D generation workflows
- 3D model visualization
- Generation progress monitoring
- Project statistics and activity tracking
- Responsive and polished user experience
- API-driven application architecture
- Scalable foundation for future architectural services

---

## Technology Stack

Brika is built using modern cross-platform technologies and supporting services.

### Application

| Technology       | Purpose                                    |
| ---------------- | ------------------------------------------ |
| **React Native** | Cross-platform application development     |
| **Expo**         | Application development and native tooling |
| **Expo Router**  | File-based application navigation          |
| **TypeScript**   | Type-safe application development          |

### Application Services

| Technology           | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| **Axios**            | HTTP communication with the Brika API              |
| **Expo SecureStore** | Secure authentication and local credential storage |

### Backend Integration

| Technology            | Purpose                                   |
| --------------------- | ----------------------------------------- |
| **Node.js / Express** | Backend API                               |
| **PostgreSQL**        | Application database                      |
| **Prisma**            | Database ORM                              |
| **Redis**             | Caching and background-job infrastructure |
| **BullMQ**            | Background job processing                 |
| **Cloudflare R2**     | Architectural file and model storage      |

---

## Architecture

The application follows a modular, component-oriented architecture designed to keep the interface maintainable while supporting continued product development.

A typical project structure is organized around application routes, reusable components, services, hooks, types, and centralized design tokens:

```text
brika-frontend/

├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (tabs)/
│   │   ├── projects/
│   │   └── ...
│   │
│   ├── components/
│   │   ├── projects/
│   │   ├── files/
│   │   ├── generation/
│   │   └── ...
│   │
│   ├── constants/
│   │   └── theme/
│   │       ├── colors.ts
│   │       ├── radius.ts
│   │       └── spacing.ts
│   │
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── ...
│
├── package.json
├── app.json
├── tsconfig.json
├── README.md
└── ...
```
