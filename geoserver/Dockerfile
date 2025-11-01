FROM docker.osgeo.org/geoserver:2.24.1

# Copy custom startup script
COPY ./init-cors.sh /tmp/init-cors.sh
RUN chmod +x /tmp/init-cors.sh

# Create a wrapper script to run CORS configuration in background
RUN echo '#!/bin/bash' > /usr/local/bin/setup-cors.sh && \
    echo 'nohup /tmp/init-cors.sh > /var/log/cors-setup.log 2>&1 &' >> /usr/local/bin/setup-cors.sh && \
    chmod +x /usr/local/bin/setup-cors.sh

# Override the entrypoint to run CORS setup
ENTRYPOINT ["/bin/bash", "-c", "/usr/local/bin/setup-cors.sh && exec /opt/startup.sh"]