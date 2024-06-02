# Use the official Jupyter base image
FROM jupyter/base-notebook:latest

# Set the working directory
WORKDIR /home/jovyan/work

# Copy the visualize.py script into the container
COPY visualize.py /home/jovyan/work/visualize.py

# Install any necessary Python packages
RUN pip install --no-cache-dir matplotlib pandas seaborn psycopg2-binary

# Switch to root user to change permissions
USER root
RUN chmod +x /home/jovyan/work/visualize.py

# Switch back to the default user
USER $NB_UID

# Disable Jupyter Notebook token authentication
RUN echo "c.NotebookApp.token = ''" >> /home/jovyan/.jupyter/jupyter_notebook_config.py

# Expose the Jupyter Notebook port
EXPOSE 8888

# Start Jupyter Notebook
CMD ["start-notebook.sh", "--NotebookApp.token=''"]
