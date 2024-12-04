SONARQUBE server setup

1. SSH into the SonarQube server provisioned 
2. Run the bash script below (installing Community version 9.9.0.65466)

```
#!/bin/bash

# Exit on error
set -e

# Update system
sudo apt update && sudo apt upgrade -y -o Dpkg::Options::="--force-confold"

# Install Java 17
sudo apt install openjdk-17-jdk -y

# Verify Java installation
java -version

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to the postgres user to create database and user for SonarQube
sudo -i -u postgres psql << EOF
CREATE USER sonarqube WITH PASSWORD 'sonar_password';
CREATE DATABASE sonarqube_db OWNER sonarqube;
EOF

# Exit from postgres user
exit

# Install unzip utility
sudo apt install unzip -y

# Download SonarQube using curl as fallback
SONARQUBE_VERSION="9.9.0.65466" # Updated to a stable version, LTS now is 9.9.7
SONARQUBE_URL="https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-$SONARQUBE_VERSION.zip"

if ! curl -f -L -o sonarqube.zip "$SONARQUBE_URL"; then
  echo "Failed to download SonarQube from the official URL using curl. Trying wget..."
  if ! wget -O sonarqube.zip "$SONARQUBE_URL"; then
    echo "Failed to download SonarQube from the official URL using wget. Trying alternative URL..."
    ALTERNATE_URL="https://alt.binaries.sonarsource.com/sonarqube-$SONARQUBE_VERSION.zip"
    if ! wget -O sonarqube.zip "$ALTERNATE_URL"; then
      echo "Failed to download SonarQube from all available URLs. Please check the URL or network connection."
      exit 1
    fi
  fi
fi

# Verify the downloaded file
if [ ! -f "sonarqube.zip" ]; then
  echo "Download failed: SonarQube zip file not found."
  exit 1
fi

# Unzip SonarQube
unzip sonarqube.zip

# Move SonarQube to /opt
sudo mv sonarqube-$SONARQUBE_VERSION /opt/sonarqube

# Configure SonarQube database credentials
sudo tee -a /opt/sonarqube/conf/sonar.properties > /dev/null << EOF
sonar.jdbc.username=sonarqube
sonar.jdbc.password=sonar_password
sonar.jdbc.url=jdbc:postgresql://localhost/sonarqube_db
sonar.web.host=0.0.0.0
EOF

# Create a system user for SonarQube
sudo adduser --system --group --no-create-home sonarqube

# Change ownership of SonarQube directory
sudo chown -R sonarqube:sonarqube /opt/sonarqube

# Set virtual memory map count for Elasticsearch
sudo sysctl -w vm.max_map_count=262144
sudo tee -a /etc/sysctl.conf > /dev/null << EOF
vm.max_map_count=262144
EOF

# Create SonarQube service
sudo tee /etc/systemd/system/sonarqube.service > /dev/null << EOF
[Unit]
Description=SonarQube service
After=syslog.target network.target

[Service]
Type=forking
ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start
ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop
User=sonarqube
Group=sonarqube
Restart=always
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd manager configuration
sudo systemctl daemon-reload

# Start and enable SonarQube service
sudo systemctl start sonarqube
sudo systemctl enable sonarqube

# Print success message
echo "SonarQube setup completed successfully! You can access it at http://<sonarqube_node_ip>:9000"
```

3. This script can be customized to upgrade SonarQube to the latest versions. However, the Developer Edition is the minimal subscription to recommend.  

4. The SonarQube service is now available at http://<sonarqube_node_ip>:9000 (Please apply cert to make it secure: https://<sonarqube_node_ip>:9000)

5. We can now log on to change the passwords, create new users, generate analysis token, create projects and adjust the security and permissions configurations according to https://docs.sonarsource.com/sonarqube/10.5/try-out-sonarqube/
