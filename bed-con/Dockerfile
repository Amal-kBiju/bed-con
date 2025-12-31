FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .

# Install all Python dependencies, including gunicorn, flask-migrate, psycopg2-binary
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install flask-migrate psycopg2-binary gunicorn

# Copy backend code INCLUDING templates and static
COPY src/backend/ /app/


# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8000

# Expose Flask port
EXPOSE 8000

# Run with Gunicorn (production-ready)
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]
