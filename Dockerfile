
FROM ubuntu:14.04
RUN apt-get update && apt-get install -y \
  apache2 \
  libapache2-mod-fcgid \
  libapache2-mod-xsendfile \
  libapache2-mod-wsgi \
  python-software-properties \
  mapserver-bin \
  gdal-bin \
  cgi-mapserver \
  python-gdal \
  python-mapscript \
  python-psycopg2 \
  python-setuptools \
  python-dev \
  python-scipy \
  libpq-dev

COPY . /localground

# required vars for apache2
#RUN mkdir /var/lock/apache2
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_LOG_DIR /var/log/apache2
ENV LANG C

# apache setup
RUN a2enmod proxy_http
COPY deploy_tools/apache_localground_config /etc/apache2/sites-available/localground.conf
RUN ln -s /etc/apache2/sites-available/localground.conf /etc/apache2/sites-enabled/localground.conf
RUN cp /localground/deploy_tools/settings_local.py /localground/apps/.
RUN rm /etc/apache2/sites-enabled/000-default.conf

# other dependancies
RUN easy_install -U pip
RUN pip install -r /localground/deploy_tools/requirements.txt
RUN ln -s /usr/lib/libgdal.so.1.17.1 /usr/lib/libgdal.so.1.17.0
#RUN pip install PIL==1.1.7

RUN mkdir /localground/userdata
RUN mkdir /localground/userdata/media
RUN mkdir /localground/userdata/prints
RUN mkdir /localground/userdata/deleted

# while developing it might be helpful to see the logs
# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/apache2/access.log
RUN ln -sf /dev/stderr /var/log/apache2/error.log



EXPOSE  80
CMD ["apache2","-DFOREGROUND"]
