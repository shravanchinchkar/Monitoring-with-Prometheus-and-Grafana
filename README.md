# Monitoring with Prometheus and Grafana

Grafana and Prometheus are tools used for monitoring the systems/applications that we build. If any issue occurs in the system, we can easily understand the root cause behind it using these tools, which helps us fix the issue quickly.

We can create a **central monitoring system** using these tools to monitor all our systems, applications, and microservices that are running.

Reference: [GitHub Gist by Piyush Garg](https://gist.github.com/piyushgarg-dev/7c4016b12301552b628bbac21a11e6ab)

## Monitoring consists of 2 parts

### 1. Metrics

These are numeric measurements of system behavior, for example:

- Latency of request and response
- CPU and memory consumption
- Number of concurrent requests coming in

### 2. Logs Collection

- Refers to the console logs we add on our server.

## Implementation Steps

### Step 1: Create a Prometheus Client

- We need to first create a Prometheus client in our codebase that will collect metrics such as:
  - CPU consumption
  - Memory utilization
  - Available RAM/memory
  - Custom application-specific metrics

- Install it using:
```bash
  npm i prom-client
```

### Step 2: Configure Grafana

- Grafana helps visualize the metrics returned by Prometheus.

### Step 3: Set Up Logging with Grafana Loki

- First, start the Grafana Loki server.
- Then, install the `winston` and `winston-loki` packages in the Node application to push logs to Grafana.