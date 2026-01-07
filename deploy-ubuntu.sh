#!/bin/bash

###############################################################################
# Demon Slayers Training Lab - Ubuntu Deployment Script
# This script automates the deployment process on Ubuntu server
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [ "$EUID" -eq 0 ]; then 
        print_warning "Running as root. Consider using a non-root user with sudo privileges."
    fi
}

# Check if Docker is installed
check_docker() {
    print_info "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        print_info "Please install Docker first:"
        echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
        echo "  sudo sh get-docker.sh"
        exit 1
    fi
    
    DOCKER_VERSION=$(docker --version)
    print_success "Docker is installed: $DOCKER_VERSION"
}

# Check if Docker Compose is installed
check_docker_compose() {
    print_info "Checking Docker Compose installation..."
    
    if ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose is not installed!"
        print_info "Docker Compose should be included with Docker. If not, install it separately."
        exit 1
    fi
    
    COMPOSE_VERSION=$(docker compose version)
    print_success "Docker Compose is installed: $COMPOSE_VERSION"
}

# Check if user is in docker group
check_docker_group() {
    print_info "Checking Docker group membership..."
    
    if groups | grep -q docker; then
        print_success "User is in docker group"
    else
        print_warning "User is not in docker group. You may need to use 'sudo' for Docker commands."
        print_info "To add user to docker group:"
        echo "  sudo usermod -aG docker $USER"
        echo "  newgrp docker"
    fi
}

# Check if compose.yml exists
check_compose_file() {
    print_info "Checking for compose.yml file..."
    
    if [ ! -f "compose.yml" ]; then
        print_error "compose.yml file not found!"
        print_info "Please make sure you're in the project root directory."
        exit 1
    fi
    
    print_success "compose.yml found"
}

# Build Docker images
build_images() {
    print_info "Building Docker images..."
    print_warning "This may take 5-15 minutes depending on your server speed..."
    
    if docker compose build; then
        print_success "Docker images built successfully"
    else
        print_error "Failed to build Docker images"
        exit 1
    fi
}

# Start services
start_services() {
    print_info "Starting services..."
    
    if docker compose up -d; then
        print_success "Services started successfully"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

# Wait for services to be ready
wait_for_services() {
    print_info "Waiting for services to initialize (60 seconds)..."
    print_warning "This is important - services need time to start up"
    
    for i in {60..1}; do
        echo -ne "\r  Waiting... $i seconds remaining"
        sleep 1
    done
    echo -ne "\r  Waiting... Done!                    "
    echo ""
}

# Check container status
check_status() {
    print_info "Checking container status..."
    echo ""
    docker compose ps
    echo ""
}

# Test application
test_application() {
    print_info "Testing application endpoints..."
    
    # Wait a bit more for application to be fully ready
    sleep 10
    
    # Test home page
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        print_success "Home page is accessible (http://localhost:3000)"
    else
        print_warning "Home page may not be ready yet. Try again in a few moments."
    fi
    
    # Test debug endpoint
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/debug | grep -q "200"; then
        print_success "Debug page is accessible (http://localhost:3000/debug)"
    else
        print_warning "Debug page may not be ready yet."
    fi
    
    # Test API endpoint
    if curl -s http://localhost:3000/api/debug/info | grep -q "system"; then
        print_success "API endpoint is responding (http://localhost:3000/api/debug/info)"
    else
        print_warning "API endpoint may not be ready yet."
    fi
}

# Get server IP
get_server_ip() {
    print_info "Detecting server IP address..."
    
    # Try to get public IP
    PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "unknown")
    
    # Get local IP
    LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "unknown")
    
    if [ "$PUBLIC_IP" != "unknown" ]; then
        print_success "Public IP: $PUBLIC_IP"
    fi
    
    if [ "$LOCAL_IP" != "unknown" ]; then
        print_success "Local IP: $LOCAL_IP"
    fi
}

# Display final information
display_final_info() {
    echo ""
    print_success "=== Deployment Complete! ==="
    echo ""
    print_info "Application URLs:"
    echo "  Local:    http://localhost:3000"
    echo "  Network:  http://$LOCAL_IP:3000"
    if [ "$PUBLIC_IP" != "unknown" ]; then
        echo "  Public:   http://$PUBLIC_IP:3000 (if firewall allows)"
    fi
    echo ""
    print_info "Useful commands:"
    echo "  View logs:        docker compose logs -f"
    echo "  Check status:    docker compose ps"
    echo "  Stop services:    docker compose down"
    echo "  Restart:          docker compose restart"
    echo ""
    print_warning "If you can't access from another machine, check firewall:"
    echo "  sudo ufw allow 3000/tcp"
    echo ""
}

# Main execution
main() {
    echo ""
    print_info "=== Demon Slayers Training Lab - Ubuntu Deployment ==="
    echo ""
    
    check_root
    check_docker
    check_docker_compose
    check_docker_group
    check_compose_file
    
    echo ""
    print_info "Starting deployment process..."
    echo ""
    
    build_images
    echo ""
    start_services
    echo ""
    wait_for_services
    echo ""
    check_status
    echo ""
    test_application
    echo ""
    get_server_ip
    display_final_info
}

# Run main function
main

