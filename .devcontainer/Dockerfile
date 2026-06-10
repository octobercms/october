FROM public.ecr.aws/docker/library/php:8.5-fpm

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  git \
  nginx \
  supervisor \
  unzip \
  libzip-dev \
  libpng-dev \
  libjpeg-dev \
  libwebp-dev \
  libfreetype6-dev \
  libpq-dev \
  sqlite3 \
  libsqlite3-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
  && docker-php-ext-install \
  zip \
  gd \
  pdo_pgsql \
  pdo_sqlite \
  && rm -rf /var/lib/apt/lists/*

COPY --from=public.ecr.aws/docker/library/composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /workspaces/october-app

CMD ["sleep", "infinity"]
