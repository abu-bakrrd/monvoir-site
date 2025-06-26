# Replit Coding Agent Guide

## Overview

**Premium Store** is a complete e-commerce web application designed as a Telegram WebApp for selling premium fashion items. The application features an elegant white background with golden accent colors, creating a luxury brand aesthetic perfect for high-end retail.

**Key Features:**
- Multi-image product galleries with touch navigation
- Advanced filtering by category, color, and price
- Shopping cart and favorites system
- Mobile-first design optimized for Telegram
- Admin category management system
- Uzbek Sum (UZS) currency support

**Status:** Production-ready and fully functional

**Store Name:** Monvoir - Premium fashion e-commerce store

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python 3.11)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Web Server**: Gunicorn for production deployment
- **Session Management**: Flask sessions with configurable secret key

### Frontend Architecture
- **Templates**: Jinja2 templating engine
- **Styling**: Vanilla CSS with custom design system
- **JavaScript**: Vanilla JavaScript with Telegram WebApp integration
- **Fonts**: Google Fonts (Inter, Poppins)

### Database Design
- **ORM**: SQLAlchemy with declarative base
- **Models**: Single Product model with fields:
  - id (Primary Key)
  - name (String, required)
  - price (Float, required)
  - category (String, required)
  - description (Text, required)
  - image_url (String, optional)
  - created_at (DateTime, auto-generated)

## Key Components

### Core Application Files
- `main.py`: Application entry point and WSGI server configuration
- `app.py`: Flask application factory with database configuration
- `models.py`: SQLAlchemy database models

### Template Structure
- `templates/index.html`: Product catalog with filtering and sorting
- `templates/product.html`: Individual product detail pages
- `templates/add_product.html`: Admin interface for adding products

### Static Assets
- `static/css/style.css`: Complete design system with CSS custom properties
- `static/js/main.js`: Telegram WebApp integration and interactive features

### Configuration
- Environment-based configuration for database and sessions
- Upload folder configuration for product images
- File size limits (16MB max)

## Data Flow

### Product Display Flow
1. User accesses main page (`/`)
2. Flask loads all products from SQLite database
3. Products are filtered/sorted based on URL parameters
4. Template renders product grid with categories and sorting options

### Product Management Flow
1. Admin accesses add product form (`/admin`)
2. Form submission creates new Product instance
3. Data validated and saved to SQLite database
4. User redirected with success/error flash message

### Telegram WebApp Integration
1. JavaScript initializes Telegram WebApp API
2. Theme colors applied from Telegram client
3. WebApp expanded to full screen
4. Native Telegram UI elements integrated

## External Dependencies

### Python Packages
- Flask 3.1.1 (web framework)
- Flask-SQLAlchemy 3.1.1 (database ORM)
- Gunicorn 23.0.0 (WSGI server)
- Werkzeug 3.1.3 (WSGI utilities)
- SQLAlchemy 2.0.41 (database toolkit)
- Email-validator 2.2.0 (email validation)
- Psycopg2-binary 2.9.10 (PostgreSQL adapter, for future use)

### External Services
- Google Fonts API (Inter, Poppins fonts)
- Telegram WebApp JavaScript API

### System Dependencies
- OpenSSL (encryption support)
- PostgreSQL (configured but not actively used)

## Deployment Strategy

### Replit Configuration
- Python 3.11 runtime environment
- Nix package manager for system dependencies
- Auto-scaling deployment target
- Gunicorn WSGI server binding to 0.0.0.0:5000

### Development Workflow
- Hot reload enabled with Gunicorn `--reload` flag
- Port 5000 configured for both development and production
- PostgreSQL database hosted on Replit with automatic connection pooling

### Production Considerations
- ProxyFix middleware for proper header handling
- Database connection pooling with auto-reconnection
- Session secret from environment variables
- File upload size limits enforced

## Recent Changes

### Project Completed - June 25, 2025
✅ **Premium E-Commerce Store for Telegram WebApp** - Fully functional with all requested features:

**Core Features:**
- Multi-image gallery system with touch/swipe navigation
- Premium golden theme with white background
- Shopping cart and favorites functionality
- Advanced search and filtering (category, color, price range)
- Mobile-optimized interface with enhanced touch targets

**Admin System:**
- Dynamic category management system
- Standalone Python script for product management
- Database-driven categories with admin controls

**Technical Implementation:**
- PostgreSQL database with proper relationships
- Uzbek Sum (UZS) currency throughout
- Clean SVG icons and golden gradient buttons
- Telegram WebApp integration with theme support
- Touch-optimized gallery navigation with backdrop blur effects

**Final Status:** Ready for deployment and production use

### Latest Updates - June 26, 2025
✅ **Monvoir Branding and Enhanced Features:**
- Rebranded store name from "Premium Store" to "Monvoir" across all pages
- Added visual color indicators (emoji circles) to color filtering for better UX
- Optimized search input with client-side caching and instant feedback
- Enhanced search performance with debounced input and result caching
- Updated currency symbols to UZS in all sorting options
- Improved search autocomplete settings (disabled autocomplete/spellcheck)
- Removed hover effects for better mobile touch experience
- Enhanced search button design with larger touch targets and better visual feedback

## Changelog

- June 25, 2025: Initial setup with premium e-commerce store
- June 25, 2025: Added cart and favorites functionality

## User Preferences

Preferred communication style: Simple, everyday language.