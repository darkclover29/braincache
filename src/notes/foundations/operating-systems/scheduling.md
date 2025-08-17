---
id: scheduling
title: "CPU Scheduling"
---

## CPU Scheduling Diagram

```mermaid
flowchart LR
  R[Ready Queue] -->|dispatch| CPU[CPU Running]
  CPU -->|I/O request| IO[Waiting for I/O]
  IO -->|I/O done| R
  CPU -->|time slice over| R
```
