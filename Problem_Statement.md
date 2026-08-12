# Problem Statement

## 1. Title

Movies, Webseries Review & Rating Aggregation Platform

## 2. Domain

Entertainment Technology / MediaTech

## 3. Who is the user?

1. **User** – Browses movies and webseries, views ratings and reviews, submits ratings and reviews, and maintains a personal watchlist.
2. **Administrator** – Manages movies and webseries, monitors user-generated reviews and ratings, and handles inappropriate or reported content.

## 4. What problem are we solving?

Users often need to visit multiple platforms to understand the quality and popularity of movies and webseries. Ratings and reviews may be scattered across different sources, making it difficult for users to compare content and make informed viewing decisions. The proposed platform provides a centralized system where users can browse movies and webseries, submit ratings and reviews, and view aggregated ratings. The system will also provide administrative controls to manage content and maintain the quality of user-generated information.

## 5. Proposed Solution

The application will provide the following features:

- User registration and secure login.
- Role-based access for Users and Administrators.
- Browse and search movies and webseries.
- View detailed information about movies and webseries.
- Submit ratings for movies and webseries.
- Submit written reviews.
- Display aggregated ratings based on user ratings.
- Display user reviews for each content item.
- Maintain a personal watchlist.
- Allow administrators to add, edit, and remove movies and webseries.
- Allow administrators to manage inappropriate or reported user-generated content.
- Provide REST APIs for frontend-backend communication.
- Provide API documentation through Swagger/OpenAPI.
- Provide a health-check endpoint for service monitoring.
- Provide scope for a third-party integration.
- Provide scope for an AI-based recommendation enhancement in the later phase.

## 6. Core Entities / Database Tables

1. **User** – Stores registered user information and role.
2. **Content** – Stores common information about movies and webseries.
3. **Genre** – Stores content genres.
4. **Rating** – Stores ratings submitted by users.
5. **Review** – Stores written reviews submitted by users.
6. **Watchlist** – Stores content saved by users.
7. **Report** – Stores reports related to inappropriate user-generated content.

These entities will have appropriate primary-key and foreign-key relationships.

## 7. User Roles & Permissions

### User

- Register and log in.
- Browse movies and webseries.
- View content details.
- Submit ratings.
- Submit reviews.
- Add or remove content from the watchlist.
- View aggregated ratings and reviews.
- Report inappropriate user-generated content.

### Administrator

- Log in through the administrator role.
- Add new movies and webseries.
- Edit existing content information.
- Remove inappropriate or invalid content.
- Monitor user reviews and reports.
- Manage reported user-generated content.

## 8. Success Criteria

- A registered user should be able to create an account and log in successfully.
- An authenticated user should be able to browse and view movie/webseries details.
- A user should be able to submit a rating and review successfully.
- The system should calculate and display an aggregated rating for content.
- An administrator should be able to manage movie and webseries information.
- Core user flows should work end-to-end from React frontend through the REST API to the database and back to the frontend.
- The application should run locally using the instructions provided in the README.

## 9. Out of Scope

The following features will not be included in the initial MVP:

- Advanced AI recommendation engine.
- Real-time streaming of movies or webseries.
- Video hosting or content distribution.
- Online movie/webseries ticket booking.
- Real-money payment processing.
- Social-media-style messaging or chat.
- Advanced fraud-detection and machine-learning-based rating manipulation detection.

These features may be considered as future enhancements where appropriate.

## 10. Chosen Track

**Python — FastAPI**

### Technology Stack

- Frontend: React.js + JavaScript
- Styling: Bootstrap
- API Communication: Axios
- Backend: FastAPI
- Language: Python 3.10+
- Authentication: JWT
- ORM/Data Layer: SQLAlchemy
- Database: MySQL 8
- Testing: Pytest
- API Documentation: FastAPI Swagger/OpenAPI
- CI/CD: GitHub Actions