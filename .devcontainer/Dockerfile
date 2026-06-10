FROM php:8.4-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  unzip \
  libzip-dev \
  libpng-dev \
  libjpeg-dev \
  libwebp-dev \
  libfreetype6-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
  && docker-php-ext-install \
  zip \
  gd \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
