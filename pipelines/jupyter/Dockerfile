# Use the official Jupyter base image
FROM jupyter/base-notebook:latest

# Set the working directory
WORKDIR /home/jovyan/work

# Copy the visualize.py script into the container
COPY visualize.py /home/jovyan/work/visualize.py

# Install any necessary Python packages
RUN pip install --no-cache-dir matplotlib pandas seaborn

# Expose the Jupyter Notebook port
EXPOSE 8888

# Start Jupyter Notebook
CMD ["start-notebook.sh"]
