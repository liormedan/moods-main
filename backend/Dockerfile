# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
# We need to copy from backend/ to /app, maintaining the structure
# So backend/app/ becomes /app/app/
COPY . .

# Expose port (Cloud Run uses PORT environment variable)
ENV PORT=8080
EXPOSE 8080

# Run the application
# Since we're in /app (which is backend/), we use: uvicorn app.main:app
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}

