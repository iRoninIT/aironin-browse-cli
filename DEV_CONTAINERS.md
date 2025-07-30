# 🐳 Dev Containers Support

This guide explains how to use the Browser Automation CLI in development containers with Chrome running on your host machine.

## 🎯 Why Dev Containers?

-   **Isolated Environment**: Run browser automation in a clean, isolated container
-   **Host Chrome**: Use Chrome installed on your host machine (no need to install in container)
-   **Cross-Platform**: Works on Windows, macOS, and Linux
-   **Easy Setup**: Pre-configured development environment

## 🚀 Quick Start

### 1. Start Chrome on Host Machine

First, start Chrome with remote debugging enabled on your host machine:

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Linux
google-chrome --remote-debugging-port=9222

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

### 2. Open in Dev Container

1. Open this project in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Select "Dev Containers: Reopen in Container"
4. Wait for the container to build and start

### 3. Test Connection

```bash
# Test auto-discovery
browser-automation test-connection

# Or use the dev-containers helper
browser-automation dev-containers
```

### 4. Use Browser Automation

```bash
# Set environment variables
export REMOTE_BROWSER_ENABLED=true
export REMOTE_BROWSER_HOST=http://host.docker.internal:9222

# Test the setup
browser-automation test

# Launch browser
browser-automation launch https://example.com
```

## 🔧 Configuration

### Environment Variables

Set these in your dev container:

```bash
# Enable remote browser connection
export REMOTE_BROWSER_ENABLED=true

# Host machine Chrome URL (auto-discovered)
export REMOTE_BROWSER_HOST=http://host.docker.internal:9222

# Optional: Custom viewport size
export BROWSER_VIEWPORT_SIZE=1200x800

# Optional: Screenshot quality (1-100)
export SCREENSHOT_QUALITY=85
```

### Host Discovery Methods

The CLI automatically tries these methods to find your host Chrome:

1. **host.docker.internal** (Docker Desktop)
2. **gateway.docker.internal** (Docker Desktop)
3. **localhost** and **127.0.0.1**
4. **Network interface scanning**
5. **Common Docker host IPs**

## 🛠️ Commands

### Test Connection

```bash
# Auto-discover Chrome instances
browser-automation test-connection

# Test specific host
browser-automation test-connection --host http://192.168.1.100:9222

# Test different port
browser-automation test-connection --port 9223
```

### Dev Containers Helper

```bash
# Interactive setup guide
browser-automation dev-containers

# With specific host IP
browser-automation dev-containers --host 192.168.1.100

# With custom port
browser-automation dev-containers --port 9223
```

## 🔍 Troubleshooting

### Chrome Not Found

1. **Check if Chrome is running**:

    ```bash
    # On host machine
    ps aux | grep chrome
    ```

2. **Verify remote debugging port**:

    ```bash
    # On host machine
    curl http://localhost:9222/json/version
    ```

3. **Check network connectivity**:
    ```bash
    # In container
    curl http://host.docker.internal:9222/json/version
    ```

### Connection Issues

1. **Firewall blocking port 9222**:

    ```bash
    # On host machine (Linux)
    sudo ufw allow 9222
    ```

2. **Docker network issues**:

    ```bash
    # Check Docker network
    docker network ls
    docker network inspect bridge
    ```

3. **Host IP changed**:
    ```bash
    # Find current host IP
    ip addr show | grep inet
    ```

### Common Error Messages

**"No Chrome instances found"**:

-   Chrome not started with `--remote-debugging-port=9222`
-   Port 9222 blocked by firewall
-   Chrome running on different port

**"Failed to connect to discovered host"**:

-   Network connectivity issues
-   Chrome crashed or closed
-   Wrong host IP address

**"Connection timeout"**:

-   Firewall blocking connection
-   Chrome not accepting connections
-   Network configuration issues

## 📋 Examples

### Basic Usage

```bash
# 1. Start Chrome on host
google-chrome --remote-debugging-port=9222

# 2. In dev container
export REMOTE_BROWSER_ENABLED=true
browser-automation test-connection

# 3. Use browser automation
browser-automation launch https://example.com
browser-automation click 200,300
browser-automation type "Hello World"
```

### Advanced Setup

```bash
# Custom configuration
export REMOTE_BROWSER_HOST=http://192.168.1.100:9222
export BROWSER_VIEWPORT_SIZE=1400x900
export SCREENSHOT_QUALITY=90

# Test with custom settings
browser-automation test-connection --host http://192.168.1.100:9222

# Interactive mode
browser-automation interactive
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Browser Automation Tests
on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "20"
            - run: npm install -g pnpm
            - run: pnpm install
            - run: pnpm build
            - run: |
                  # Start Chrome in background
                  google-chrome --remote-debugging-port=9222 --headless &
                  sleep 5
                  # Run tests
                  export REMOTE_BROWSER_ENABLED=true
                  export REMOTE_BROWSER_HOST=http://localhost:9222
                  pnpm test
```

## 🔗 Integration with Other Tools

### VS Code Dev Containers

The `.devcontainer/devcontainer.json` file is pre-configured for this project:

-   **Node.js 20**: Latest LTS version
-   **pnpm**: Fast package manager
-   **Port forwarding**: Chrome debugging port 9222
-   **Extensions**: TypeScript, Prettier, JSON support

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"
services:
    browser-automation:
        build: .
        ports:
            - "9222:9222"
        environment:
            - REMOTE_BROWSER_ENABLED=true
            - REMOTE_BROWSER_HOST=http://host.docker.internal:9222
        volumes:
            - .:/workspace
```

### Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: browser-automation
spec:
    replicas: 1
    selector:
        matchLabels:
            app: browser-automation
    template:
        metadata:
            labels:
                app: browser-automation
        spec:
            containers:
                - name: browser-automation
                  image: browser-automation:latest
                  env:
                      - name: REMOTE_BROWSER_ENABLED
                        value: "true"
                      - name: REMOTE_BROWSER_HOST
                        value: "http://chrome-service:9222"
```

## 📚 Additional Resources

-   [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
-   [Docker Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
-   [Puppeteer Documentation](https://pptr.dev/)
-   [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/devcontainerjson)

---

**Ready to automate browsers in dev containers!** 🐳🎯
