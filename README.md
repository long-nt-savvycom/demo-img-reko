# Content Moderation Service

## Overview

This project is a content moderation service that allows moderators to review posts and approve or reject them based on specific criteria, such as inappropriate content. The service is built with a **Nest.js** backend for API management and a **Next.js** frontend for a responsive user interface.

## Features

- **Backend (Nest.js)**:
  - CRUD operations for posts
  - Image moderation using AWS Rekognition
  - Status tracking (open, approved, rejected)
  - API endpoints for managing posts
  - [Backend document here](./backend/README.md)
  
- **Frontend (Next.js)**:
  - View a list of submitted posts
  - Approve or reject posts
  - View posts with images

## Technology Stack

- **Backend**: Nest.js, TypeScript, AWS SDK
- **Frontend**: Next.js, React, TypeScript
- **Database**:  PostgreSQL
- **Cloud Services**: AWS Rekognition

## Prerequisites

- Node.js (version 18 or above)
- npm or yarn
- AWS account (for Rekognition)
- Docker (optional, for containerization)

## Project Structure


