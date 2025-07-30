# aiRonin Browse CLI

A command-line tool for browser automation with **headed Chrome support** - perfect for AI agents that need to see what they're doing in real-time.

## 🎯 Why This Tool?

- **AI Agent Optimized**: Screenshot analysis and visual feedback for AI decision-making
- **Remote Browser Detection**: Automatically finds and uses remote browsers when available
- **Headed Mode**: Unlike headless automation, you can see the browser in action
- **Real-time Visibility**: Watch AI agents interact with web pages
- **Better Debugging**: Screenshots and console logs help debug issues
- **Smart Tab Management**: Handles multiple tabs and domains intelligently
- **Network Monitoring**: Automatically waits for page loads after interactions

## 📋 Prerequisites

- **Node.js**: 20.0.0 or higher
- **pnpm**: 10.0.0 or higher (recommended) or npm
- **Chrome/Chromium**: Will be downloaded automatically

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/iRoninIT/aironin-browse-cli.git
cd aironin-browse-cli

# Install dependencies
pnpm install

# Build the tool
pnpm build

# Make it globally available (optional)
pnpm link
```

### Basic Usage

```bash
# Test the browser automation
aironin-browse test

# Launch browser and navigate to a URL
aironin-browse launch https://example.com

# Click at coordinates
aironin-browse click 200,300

# Type text
aironin-browse type "Hello World"

# Scroll down
aironin-browse scroll down

# Close browser
aironin-browse close
```

## 📖 Command Reference

### Global Options

```bash
-v, --viewport <size>    Browser viewport size (e.g., 900x600)
-q, --quality <number>    Screenshot quality (1-100)
-r, --remote             Force remote browser connection (default: auto-detect)
-h, --host <url>         Remote browser host URL
```

### Commands

#### `test [options]`

Test browser connection and functionality.

```bash
# Basic test
aironin-browse test

# Test with custom URL
aironin-browse test --url https://google.com

# Test with remote browser (auto-detection enabled by default)
aironin-browse test --remote --host http://localhost:9222
```

#### `launch <url>`

Launch browser and navigate to URL.

```bash
aironin-browse launch https://example.com
```

#### `click <coordinates>`

Click at specified coordinates.

```bash
# Click at x=200, y=300
aironin-browse click 200,300
```

#### `type <text>`

Type text into the browser.

```bash
aironin-browse type "Hello World"
```

#### `scroll <direction>`

Scroll the page up or down.

```bash
# Scroll down
aironin-browse scroll down

# Scroll up
aironin-browse scroll up
```

#### `hover <coordinates>`

Hover at specified coordinates.

```bash
aironin-browse hover 200,300
```

#### `resize <size>`

Resize browser window.

```bash
# Resize to 1200x800
aironin-browse resize 1200,800
```

#### `close`

Close the browser.

```bash
aironin-browse close
```

#### `interactive`

Start interactive mode for manual testing.

```bash
aironin-browse interactive
```

## 🔧 Configuration

### Environment Variables

You can configure the tool using environment variables:

```bash
# Browser viewport size
export BROWSER_VIEWPORT_SIZE=1200x800

# Screenshot quality (1-100)
export SCREENSHOT_QUALITY=85

# Enable remote browser connection
export REMOTE_BROWSER_ENABLED=true

# Remote browser host URL
export REMOTE_BROWSER_HOST=http://localhost:9222
```

### Remote Browser Setup

To connect to an existing Chrome instance:

1. Start Chrome with remote debugging:

   ```bash
   chrome --remote-debugging-port=9222
   ```

2. The tool will automatically detect and connect to remote browsers:

   ```bash
   aironin-browse launch https://example.com
   ```

3. Or force remote connection:

   ```bash
   export REMOTE_BROWSER_ENABLED=true
   export REMOTE_BROWSER_HOST=http://localhost:9222
   aironin-browse launch https://example.com
   ```

## 🧪 Interactive Mode

Interactive mode allows you to test commands manually:

```bash
aironin-browse interactive
```

Available commands in interactive mode:

- `help` - Show available commands
- `test` - Run connection test
- `launch <url>` - Launch browser and navigate
- `click <x,y>` - Click at coordinates
- `type <text>` - Type text
- `scroll <up|down>` - Scroll page
- `hover <x,y>` - Hover at coordinates
- `resize <w,h>` - Resize browser window
- `close` - Close browser
- `exit` - Exit interactive mode

Example session:

```
aironin> test
aironin> launch https://example.com
aironin> click 200,300
aironin> type Hello World
aironin> scroll down
aironin> exit
```

## 🔍 Troubleshooting

### Common Issues

1. **Chrome not launching**:

   - Ensure sufficient disk space for Chromium download
   - Check internet connection for Chromium download
   - Verify Chrome/Chromium is not already running in debug mode

2. **Permission errors**:

   - Check file permissions for storage directory
   - Ensure write access to current directory

3. **Remote connection fails**:
   - Verify Chrome is running with `--remote-debugging-port=9222`
   - Check firewall settings
   - Ensure correct host URL

### Debug Mode

Enable debug logging:

```bash
DEBUG=aironin-browse* aironin-browse launch https://example.com
```

### Getting Help

```bash
# Show all commands
aironin-browse --help

# Show help for specific command
aironin-browse launch --help
```

## 🛠️ Development

### Building from Source

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint
```

### Project Structure

```
aironin-browse-cli/
├── src/
│   ├── cli.ts              # Main CLI entry point
│   └── browser/
│       ├── BrowserSession.ts    # Core browser automation
│       └── browserDiscovery.ts  # Browser discovery utilities
├── dist/                   # Built files
├── package.json
└── tsconfig.json
```

### Adding New Commands

1. Add command to `src/cli.ts`:

   ```typescript
   program
     .command("mycommand")
     .description("My new command")
     .argument("<param>", "Parameter description")
     .action(async (param: string) => {
       // Command implementation
     });
   ```

2. Rebuild:
   ```bash
   pnpm build
   ```

## 📦 API Reference

### BrowserSession Class

The core browser automation class:

```typescript
import { BrowserSession } from "./browser/BrowserSession.js";

const browser = new BrowserSession();

// Launch browser
await browser.launchBrowser();

// Navigate to URL
const result = await browser.navigateToUrl("https://example.com");

// Click at coordinates
await browser.click("200,300");

// Type text
await browser.type("Hello World");

// Scroll
await browser.scrollDown();
await browser.scrollUp();

// Close browser
await browser.closeBrowser();
```

### Return Values

All actions return a `BrowserActionResult`:

```typescript
interface BrowserActionResult {
  screenshot?: string; // Base64 encoded screenshot
  logs?: string; // Console logs
  currentUrl?: string; // Current page URL
  currentMousePosition?: string; // Last mouse position
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🏢 About

**aiRonin Browse CLI** is developed by **CK @ iRonin.IT**.

**iRonin.IT** is a software development company specializing in AI-powered tools and automation solutions.

## 🆘 Support

For issues and questions:

- Open an issue on the repository
- Check the troubleshooting section
- Review the configuration options

---

**Ready to automate browsers with full visibility!** 🎯
