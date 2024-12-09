# Use the official Python image from the Docker Hub
FROM python:3.9

# Set the working directory in the Docker container
WORKDIR /app

# Copy the requirements.txt file into the Docker image
COPY hease/requirements.txt .

# Install the dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8081 to allow external access
EXPOSE 8081

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]