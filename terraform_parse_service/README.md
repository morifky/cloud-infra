# Terraform Parse Service

## High-Level Architecture

The service follows a layered architecture to strictly separate API contracts from Terraform resource logic.

### Sequence Flow
1. **Client Request**: Sends JSON payload to the API.
2. **Fastify API**: Receives request and triggers the **DTO Layer**.
3. **DTO Layer**: Validates input using Zod and passes typed data to the **Mapper**.
4. **Mapper Layer**:
    - Queries the **Model Registry** for resource templates.
    - Hydrates templates with request data.
    - Resolves dependencies (e.g., links EC2 to Security Group).
5. **Generator Engine**: Renders individual model attributes into HCL format.
6. **Response**: Returns the consolidated `.tf` file as a download.

### Layers:
1.  **DTO (`src/dto`)**: Handles validation using Zod. Consolidates request schemas.
2.  **Mapper (`src/mappers`)**: Contains the business logic to transform high-level requests into specific Terraform resource combinations. Handles dependencies (e.g., linking an Instance to its Security Group).
3.  **Model Registry (`src/models/definitions`)**: A versioned collection of static templates for Terraform resources (Providers, S3, EC2, Data Sources).
4.  **Generator (`src/generators`)**: A generic engine that renders any `TerraformModel` into valid HCL syntax.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Podman or Docker (for HCL validation)

### Installation
```bash
npm install
```

### Running the Service
```bash
npm run build
npm start
```
The server will be available at `http://localhost:3000`.

### API Documentation

The service includes an interactive Swagger UI for exploring and testing the API endpoints.

Once the service is running, you can access the documentation at:
`http://localhost:3000/apidocs`

This UI allows you to:
- View all available API endpoints.
- See the expected request schemas (JSON payloads).
- Try out the API directly from your browser.

---

## Usage Examples

### 1. Generate S3 Resources
```bash
curl -X POST http://localhost:3000/api/v1/aws/s3 \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {
        "region": "us-east-1",
        "bucket_name": "my-secure-bucket",
        "acl": "private"
    }
  }' --output s3.tf
```

### 2. Generate EC2 Resources
```bash
curl -X POST http://localhost:3000/api/v1/aws/ec2 \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {
        "region": "us-east-1",
        "instance_name": "web-server",
        "ami": "ami-12345678",
        "instance_type": "t3.micro",
        "vpc_id": "vpc-0abc1234",
        "subnet_id": "subnet-0xyz9876"
    }
  }' --output ec2.tf
```

---

## Validation

To validate the generated code using the official Terraform CLI docker image:

### 1. Initialize Terraform
```bash
podman run --rm -v $(pwd):/workspace -w /workspace hashicorp/terraform:1.14 init
```

### 2. Validate Configuration
```bash
podman run --rm -v $(pwd):/workspace -w /workspace hashicorp/terraform:1.14 validate
```

*Note: Replace `podman` with `docker` if you are using Docker Desktop.*
