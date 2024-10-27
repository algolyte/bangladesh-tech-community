# Use an official Python runtime as the base image
FROM python:3.9-bullseye

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the rest of the application files into the container
COPY . .

# Expose the port the server will run on
EXPOSE 8070

# Command to run Python's HTTP server
CMD ["python3", "-m", "http.server", "8070"]
