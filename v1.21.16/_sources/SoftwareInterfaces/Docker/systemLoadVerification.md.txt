---
nosearch: true
---

# System load verification
As part of a shared resource embedded system we provide certain guidelines

To measure CPU load using Prometheus and node_exporter, you need to follow these steps:

**1. Install Prometheus and node_exporter:**
Ensure Prometheus and node_exporter are installed and running on your system. If not, you can download and install them from the official Prometheus downloads page.

Configure node_exporter:
node_exporter is a Prometheus exporter for hardware and OS metrics. Download the node_exporter binary from the releases page, extract it, and run it:

```sh
./node_exporter
```

By default, node_exporter will run on port 9100. You can verify it's running by visiting http://<your_server_ip>:9100/metrics in your browser.

**3. Configure Prometheus to scrape node_exporter:**

Modify the Prometheus configuration file (prometheus.yml) to add a scrape job for node_exporter. Here's an example configuration snippet:

```yaml

scrape_configs:
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['<your_server_ip>:9100']
```

Restart Prometheus to apply the new configuration:
```sh
sudo systemctl restart prometheus
```

**4.Prometheus Metrics for CPU Load:**

+ node_exporter exposes several CPU-related metrics. Some of the key metrics for CPU load are:
    + node_load1: 1-minute load average.
    + node_load5: 5-minute load average.
    + node_load15: 15-minute load average.
    + node_cpu_seconds_total: Total CPU time spent in different modes (user, system, idle, etc.).

**5. Querying CPU Load in Prometheus:**
You can use Prometheus’ query language (PromQL) to query these metrics. Examples:

To get the 1-minute load average:
```text
node_load1
```

To get the per-CPU usage percentage:
```promql
rate(node_cpu_seconds_total{mode="user"}[1m]) * 100
```

To get the overall CPU usage percentage (all modes except idle):
```promql
1 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)
```

**6. Visualizing CPU Load (optional)**

Use Prometheus' built-in graphing capabilities or integrate with Grafana for advanced visualizations.
In Grafana, add Prometheus as a data source and create dashboards with panels that visualize the CPU load metrics.
Example Grafana query for 1-minute load average:

```text
node_load1
```

Example Prometheus Query for CPU Load Average:
Here's a practical example of a Prometheus query for CPU load average over the past 5 minutes:

```promql
avg(node_load5) by (instance)
```

This query will average the 5-minute load average (node_load5) across all instances.
Example Grafana Panel for CPU Usage:

    Add a new panel in Grafana.
    Set the data source to Prometheus.
    Use the following PromQL query to visualize the overall CPU usage:

    promql

    1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance) * 100

    Set the visualization type (e.g., graph, gauge) and customize as needed.

By following these steps, you can effectively measure and visualize CPU load on your systems using Prometheus and node_exporter.