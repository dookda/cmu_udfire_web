#!/bin/bash
set -e

echo "Configuring CORS for GeoServer..."

# Correct path for GeoServer web.xml
WEB_XML="/opt/apache-tomcat-9.0.82/webapps/geoserver/WEB-INF/web.xml"

# Wait for GeoServer webapp to be deployed
echo "Waiting for GeoServer webapp to be deployed..."
for i in {1..30}; do
    if [ -f "$WEB_XML" ]; then
        echo "web.xml found!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

if [ -f "$WEB_XML" ]; then
    if ! grep -q "CorsFilter" "$WEB_XML"; then
        echo "Adding CORS filter configuration..."

        # Backup original
        cp "$WEB_XML" "${WEB_XML}.bak"

        # Create a temporary file with CORS filter
        cat > /tmp/cors-filter.xml << 'EOFCORS'

  <!-- CORS Configuration -->
  <filter>
    <filter-name>CorsFilter</filter-name>
    <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
    <init-param>
      <param-name>cors.allowed.origins</param-name>
      <param-value>*</param-value>
    </init-param>
    <init-param>
      <param-name>cors.allowed.methods</param-name>
      <param-value>GET,POST,HEAD,OPTIONS,PUT,DELETE</param-value>
    </init-param>
    <init-param>
      <param-name>cors.allowed.headers</param-name>
      <param-value>*</param-value>
    </init-param>
  </filter>

  <filter-mapping>
    <filter-name>CorsFilter</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
EOFCORS

        # Insert after the <web-app> opening tag
        sed -i '/<web-app/r /tmp/cors-filter.xml' "$WEB_XML"

        echo "CORS filter added successfully!"
        rm /tmp/cors-filter.xml
    else
        echo "CORS filter already configured."
    fi
else
    echo "Warning: web.xml not found at $WEB_XML after 60 seconds"
fi