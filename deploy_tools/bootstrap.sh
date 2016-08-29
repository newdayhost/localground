#!/bin/bash -ex

sudo apt update
############################
# Install Useful Utilities #
############################
sudo apt install -y git curl vim

###################################
# Install Apache-Related Packages #
###################################
echo "Y" | sudo apt install apache2
echo "Y" | sudo apt install libapache2-mod-fcgid
echo "Y" | sudo apt install libapache2-mod-xsendfile
echo "Y" | sudo apt install libapache2-mod-wsgi
echo "Y" | sudo apt install sendmail
echo "Y" | sudo apt install libmail-sendmail-perl

################
# Install Java #
################
#version went from 7 to 8
sudo apt -y install openjdk-8-jre

#######################################
# Install GDAL, MapServer, Etc. First #
#######################################
echo "Y" | sudo apt install python-software-properties
echo "Y" | sudo apt install mapserver-bin
echo "Y" | sudo apt install gdal-bin
echo "Y" | sudo apt install cgi-mapserver
echo "Y" | sudo apt install python-gdal
echo "Y" | sudo apt install python-mapscript
	
###############################################
# Add the google projection to the proj4 file #
###############################################
PROJ_FILE=/usr/share/proj/epsg
sudo printf '\n#Google Projection\n<900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs\n' | sudo tee -a $PROJ_FILE

###########################################
# Then Install PostgreSQL9.1, PostGIS 9.5 #
###########################################
echo "Y" | sudo apt install postgresql-9.5
echo "Y" | sudo apt install postgresql-client-9.5
echo "Y" | sudo apt install postgresql-server-dev-9.5
echo "Y" | sudo apt install postgresql-plperl-9.5
echo "Y" | sudo apt install postgresql-9.5-postgis-2.2
echo "Y" | sudo apt install postgresql-9.5-postgis-scripts
echo "Y" | sudo apt install libpq-dev

##################################
# Configure PostgreSQL / PostGIS #
##################################
# Doing some automatic config file manipulations for postgres / postgis:
DB_OWNER="postgres"
DB_NAME="lg_test_database"
DB_PASSWORD="password"
PG_VERSION=9.5
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
PEER="local   all             postgres                                peer"
TRUST="local   all             postgres                                trust"
MD5="local   all             postgres                                md5"
sudo sed -i "s/$PEER/$TRUST/g" $PG_HBA
sudo sed -i "s/$MD5/$TRUST/g" $PG_HBA
sudo service postgresql restart
CREATE_SQL="create database $DB_NAME;"
psql -c "$CREATE_SQL" -U postgres
psql -c "CREATE EXTENSION postgis;" -U postgres -d $DB_NAME
psql -c "CREATE EXTENSION postgis_topology;" -U postgres -d $DB_NAME
psql -c "alter user postgres with encrypted password '$DB_PASSWORD';" -U postgres
sudo sed -i "s/$TRUST/$MD5/g" $PG_HBA
sudo service postgresql restart

########################################################################
# Install Graphics, Miscellaneous Stuff...
########################################################################
echo "Y" | sudo apt install python-gdal
echo "Y" | sudo apt install libcv-dev libopencv-dev python-opencv
echo "Y" | sudo apt install python-psycopg2
echo "Y" | sudo apt install python-setuptools
echo "Y" | sudo apt install python-pip
sudo pip install --upgrade pip
echo "Y" | sudo apt install python-dev
echo "Y" | sudo apt install python-mapscript
echo "Y" | sudo apt install python-scipy
#sudo add-apt-repository -y ppa:mc3man/trusty-media #trusty ubuntu doesn't have an ffmpeg package (only libav)
#sudo apt update
echo "Y" | sudo apt install ffmpeg
#echo "Y" | sudo apt install libavcodec-extra-53
echo "Y" | sudo apt install redis-server


############################
# Install PIP Dependencies #
############################
# there may be some problems with the map script / map server install
#fix link
sudo ln -s /localground/ /vagrant
sudo pip install -r /vagrant/deploy_tools/requirements.txt

#############################
# Install Node.js and Bower #
#############################
#curl -sL https://deb.nodesource.com/setup | sudo bash -
#echo "Y" | sudo apt install nodejs
#echo "Y" | sudo apt install npm
#echo "Y" | sudo npm install -g bower

####################################
# Configure Local Ground on Apache #
####################################
sudo a2enmod proxy_http
sudo a2enmod ssl
sudo cp /localground/deploy_tools/apache_vagrant_config /etc/apache2/sites-available/localground.conf
sudo ln -s /etc/apache2/sites-available/localground.conf /etc/apache2/sites-enabled/localground.conf
sudo cp /localground/deploy_tools/settings_local.py /localground/apps/.
sudo rm /etc/apache2/sites-enabled/000-default.conf 
sudo service apache2 restart

###############################
# Create required directories #
###############################
cd /localground
mkdir -p userdata/media
mkdir -p userdata/prints
mkdir -p userdata/deleted
#Avoiding the issue w/serving django contrib static files vs. Apache's alias
sudo cp -r /usr/local/lib/python2.7/dist-packages/swampdragon/static/swampdragon /localground/static/swampdragon
#################
# Install Redis #
#################
sudo apt -y install redis-server rabbitmq-server

# we use supervisor to run our celery worker 
sudo apt -y install supervisor
sudo cp /localground/deploy_tools/celeryd.conf /etc/supervisor/conf.d/celeryd.conf
sudo mkdir /var/log/celery

# flower will monitor celery
sudo cp /localground/deploy_tools/flower.conf /etc/supervisor/conf.d/flower.conf


###############################################
# Create required Django tables and run tests #
###############################################
cd /localground/apps
#sudo ln -s /usr/lib/libgdal.so.1.17.1 /usr/lib/libgdal.so.1.17.0
python manage.py syncdb --noinput
python manage.py test --verbosity=2
sudo service supervisor restart
sudo supervisorctl restart celery

echo '------------------------------------'
echo ' Server configured. Check it out at '
echo ' http://localhost:7777              '
echo '------------------------------------'
