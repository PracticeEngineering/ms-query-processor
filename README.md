# Service: ms-query-processor

The primary read-side API for the Tracking System. This service provides optimized, read-only endpoints for clients to query tracking information.

## Core Responsibilities

-   Exposes a synchronous HTTP API for querying shipment and checkpoint data.
-   Handles all data fetching logic from the database.
-   Implements server-side pagination for list-based endpoints to ensure performance.
-   Formats data into clear, client-friendly DTOs.
-   Follows Clean Architecture principles.

## Technology Stack

-   **Framework**: NestJS
-   **Language**: TypeScript
-   **Database Interaction**: `pg` (raw SQL, no ORM) via Repository Pattern

## Running the Service (Local Development)

This service is part of the project's Docker Compose setup.

1.  Navigate to the root directory of the project.
2.  Run the following command:
    ```bash
    docker-compose up
    ```
The service will be available on its designated port (e.g., `http://localhost:3002`).

## Environment Variables

| Variable            | Description                               | Example Value |
| ------------------- | ----------------------------------------- | ------------- |
| `DATABASE_HOST`     | Hostname of the PostgreSQL database.      | `db`          |
| `DATABASE_PORT`     | Port of the PostgreSQL database.          | `5432`        |
| `DATABASE_USER`     | Username for the database connection.     | `user`        |
| `DATABASE_PASSWORD` | Password for the database connection.     | `password`    |
| `DATABASE_NAME`     | The name of the database to connect to.   | `tracking_db` |

**Production Note**: In a production environment, this service should be configured to connect to a **read-replica** database to isolate read/write workloads.

## API Endpoints

### Get Tracking History

-   **Endpoint**: `GET /tracking/:trackingId`
-   **Description**: Retrieves the full history for a single shipment.
-   **URL Parameter**:
    -   `trackingId` (string, required): The public tracking ID of the shipment.
-   **Success Response (`200 OK`)**:
    ```json
    {
      "trackingId": "GUIA-000001",
      "status": "DELIVERED",
      "history": [
        {
          "id": "c3a1b2c...-...",
          "status": "DELIVERED",
          "location": "Punto de Entrega, Tunja",
          "timestamp": "2025-09-20T14:30:00Z"
        },
        {
          "id": "d4e5f6a...-...",
          "status": "OUT_FOR_DELIVERY",
          "location": "Oficina Local, Medellín",
          "timestamp": "2025-09-20T08:15:00Z"
        }
      ]
    }
    ```
-   **Error Response**: `404 Not Found` if the `trackingId` does not exist.

### List Shipments by Status

-   **Endpoint**: `GET /shipments`
-   **Description**: Retrieves a paginated list of shipments that match a specific status.
-   **Query Parameters**:
    -   `status` (string, required): The status to filter by (e.g., `DELIVERED`, `IN_TRANSIT`).
    -   `page` (number, optional, default: 1): The page number to retrieve.
    -   `limit` (number, optional, default: 10): The number of items per page.
-   **Success Response (`200 OK`)**:
    ```json
    {
      "data": [
        {
          "id": "a1b2c3d...-...",
          "trackingId": "GUIA-000001",
          "currentStatus": "DELIVERED",
          "createdAt": "2025-09-18T10:00:00Z",
          "updatedAt": "2025-09-20T14:30:00Z"
        }
      ],
      "pagination": {
        "totalItems": 1450,
        "currentPage": 1,
        "totalPages": 145
      }
    }
    ```

## Events

This service does not produce or consume any events from the message broker.

## How to Run Tests

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e