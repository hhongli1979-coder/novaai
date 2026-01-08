# Use Python 3.10+ as base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt and install all dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY handler.py .

# Expose port 8000
EXPOSE 8000

# Start the FastAPI application with uvicorn
CMD ["uvicorn", "handler:app", "--host", "0.0.0.0", "--port", "8000"]
