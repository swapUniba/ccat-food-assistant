# Use the official PHP 8.2 image with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip \
    unzip \
    git \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zlib1g-dev \
    libzip-dev \
    libxslt-dev \
    libcurl4-openssl-dev \
    libssl-dev \
    libmcrypt-dev \
    libicu-dev

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install -j$(nproc) \
    gd \
    mysqli \
    zip \
    soap \
    simplexml \
    dom \
    curl \
    xml \
    mbstring \
    opcache \
    intl

# Enable Apache mod_rewrite if needed
RUN a2enmod rewrite
RUN a2enmod headers

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set the working directory
WORKDIR /var/www/html

# Copy the application code (optional if you prefer to use volumes)
# COPY ./webapp /var/www/html

# Set appropriate permissions
RUN chown -R www-data:www-data /var/www/html
