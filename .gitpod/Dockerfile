FROM php:7.3-apache

RUN apt-get update && apt-get install -y cron git-core jq unzip vim zip \
  libjpeg-dev libpng-dev libpq-dev libsqlite3-dev libwebp-dev libzip-dev && \
  rm -rf /var/lib/apt/lists/* && \
  docker-php-ext-configure zip --with-libzip && \
  docker-php-ext-configure gd --with-png-dir --with-jpeg-dir --with-webp-dir && \
  docker-php-ext-install exif gd mysqli opcache pdo_pgsql pdo_mysql zip

# Recommended opcache settings - https://secure.php.net/manual/en/opcache.installation.php
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=1'; \
  } > /usr/local/etc/php/conf.d/docker-oc-opcache.ini

RUN { \
    echo 'log_errors=on'; \
    echo 'display_errors=off'; \
    echo 'upload_max_filesize=32M'; \
    echo 'post_max_size=32M'; \
    echo 'memory_limit=128M'; \
  } > /usr/local/etc/php/conf.d/docker-oc-php.ini

RUN pecl install xdebug

RUN { \
    echo "#zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" ; \
    echo 'xdebug.remote_enable=on'; \
    echo 'xdebug.remote_autostart=off'; \
    echo 'xdebug.remote_host=host.docker.internal'; \
  } > /usr/local/etc/php/conf.d/docker-xdebug-php.ini

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
  /usr/local/bin/composer global require hirak/prestissimo

RUN a2enmod rewrite

ENV OCTOBERCMS_TAG develop

# Initialize crontab for the October CMS scheduler
RUN echo "* * * * * /usr/local/bin/php /var/www/html/artisan schedule:run > /proc/1/fd/1 2>/proc/1/fd/2" > /etc/cron.d/october-cron && \
  crontab /etc/cron.d/october-cron

# Add helpers
RUN echo 'exec php artisan "$@"' > /usr/local/bin/artisan && \
  echo 'exec php artisan tinker' > /usr/local/bin/tinker && \
  echo '[ $# -eq 0 ] && exec php artisan october || exec php artisan october:"$@"' > /usr/local/bin/october && \
  sed -i '1s;^;#!/bin/bash\n[ "$PWD" != "/var/www/html" ] \&\& echo " - Helper must be run from /var/www/html" \&\& exit 1\n;' /usr/local/bin/artisan /usr/local/bin/tinker /usr/local/bin/october && \
  chmod +x /usr/local/bin/artisan /usr/local/bin/tinker /usr/local/bin/october

# create 'gitpod' user: It is used for everything that runs inside Gitpod workspaces
RUN useradd -l -u 33333 -G sudo -md /home/gitpod -s /bin/bash -p gitpod gitpod
ENV HOME=/home/gitpod
WORKDIR $HOME

# configure Apache webserver for October in Gitpod
RUN echo "ServerName \${APACHE_SERVER_NAME}" >> /etc/apache2/apache2.conf && \
    chown -R gitpod:gitpod /etc/apache2 /var/run/apache2 /var/lock/apache2 /var/log/apache2 && \
    rm /var/log/apache2/*
COPY --chown=gitpod:gitpod apache/ /etc/apache2/

# make October config available in container
COPY --chown=gitpod:gitpod config /home/gitpod/octobercms-config-docker