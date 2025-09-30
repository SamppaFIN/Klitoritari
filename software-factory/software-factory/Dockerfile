# Autonomous Factory Docker Environment
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt requirements-test.txt ./
RUN pip install --no-cache-dir -r requirements.txt -r requirements-test.txt

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p .factory-out reports htmlcov

# Set environment variables
ENV PYTHONPATH=/app
ENV FACTORY_PROJECT_NAME=autonomous-factory
ENV FACTORY_OUT_DIR=.factory-out

# Default command
CMD ["python", "scripts/factory.py", "build"]
