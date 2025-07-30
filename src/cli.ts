#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import { BrowserSession, type BrowserActionResult } from "./browser/BrowserSession.js"
import { createInterface } from "node:readline"

const program = new Command()

program
  .name("aironin-browse")
  .description("aiRonin Browse CLI with headed Chrome support")
  .version("1.0.0")

// Global options
program
  .option("-v, --viewport <size>", "Browser viewport size (e.g., 900x600)", "900x600")
  .option("-q, --quality <number>", "Screenshot quality (1-100)", "75")
  .option("-r, --remote", "Enable remote browser connection")
  .option("-h, --host <url>", "Remote browser host URL")

// Test command
program
  .command("test")
  .description("Test browser connection and functionality")
  .option("-u, --url <url>", "Test URL to navigate to", "https://example.com")
  .action(async (options: any) => {
    try {
      console.log(chalk.yellow("🧪 Testing browser automation..."))
      
      // Set environment variables from options
      process.env.BROWSER_VIEWPORT_SIZE = options.viewport || "900x600"
      process.env.SCREENSHOT_QUALITY = (options.quality || 75).toString()
      process.env.REMOTE_BROWSER_ENABLED = options.remote ? "true" : "false"
      if (options.host) {
        process.env.REMOTE_BROWSER_HOST = options.host
      }

      const browser = new BrowserSession()
      
      // Test 1: Launch browser
      console.log(chalk.blue("1. Testing browser launch..."))
      await browser.launchBrowser()
      console.log(chalk.green("✅ Browser launched successfully"))
      
      // Test 2: Navigate to URL
      console.log(chalk.blue("2. Testing navigation..."))
      const navResult = await browser.navigateToUrl(options.url)
      console.log(chalk.green("✅ Navigation successful"))
      console.log(chalk.gray("   Current URL:"), navResult.currentUrl)
      
      // Test 3: Take screenshot
      console.log(chalk.blue("3. Testing screenshot capture..."))
      if (navResult.screenshot) {
        console.log(chalk.green("✅ Screenshot captured successfully"))
        console.log(chalk.gray("   Screenshot size:"), `${Math.round(navResult.screenshot.length / 1024)}KB`)
      } else {
        console.log(chalk.red("❌ Screenshot capture failed"))
      }
      
      // Test 4: Console logs
      console.log(chalk.blue("4. Testing console log capture..."))
      if (navResult.logs) {
        console.log(chalk.green("✅ Console logs captured"))
        console.log(chalk.gray("   Log count:"), navResult.logs.split('\n').filter(line => line.trim()).length)
      } else {
        console.log(chalk.yellow("⚠️  No console logs captured"))
      }
      
      // Test 5: Mouse interaction
      console.log(chalk.blue("5. Testing mouse interaction..."))
      const clickResult = await browser.click("100,100")
      console.log(chalk.green("✅ Mouse click successful"))
      
      // Test 6: Keyboard input
      console.log(chalk.blue("6. Testing keyboard input..."))
      const typeResult = await browser.type("test")
      console.log(chalk.green("✅ Keyboard input successful"))
      
      // Test 7: Scroll
      console.log(chalk.blue("7. Testing scroll..."))
      const scrollResult = await browser.scrollDown()
      console.log(chalk.green("✅ Scroll successful"))
      
      // Test 8: Close browser
      console.log(chalk.blue("8. Testing browser close..."))
      await browser.closeBrowser()
      console.log(chalk.green("✅ Browser closed successfully"))
      
      console.log(chalk.green("\n🎉 All tests passed! Browser automation is working correctly."))
      console.log(chalk.gray("\nYou can now use the browser automation tool with your AI agent."))
      
    } catch (error) {
      console.error(chalk.red("❌ Test failed:"), error)
      console.log(chalk.yellow("\nTroubleshooting tips:"))
      console.log(chalk.gray("1. Ensure you have sufficient disk space for Chromium download"))
      console.log(chalk.gray("2. Check your internet connection for Chromium download"))
      console.log(chalk.gray("3. Verify Chrome/Chromium is not already running in debug mode"))
      console.log(chalk.gray("4. Try running with --remote flag if you have Chrome running with --remote-debugging-port=9222"))
      process.exit(1)
    }
  })

// Launch command
program
  .command("launch")
  .description("Launch browser and navigate to URL")
  .argument("<url>", "URL to navigate to")
  .option("-r, --remote <boolean>", "Connect to remote Chrome browser", "true")
  .option("--host <host>", "Remote Chrome host URL")
  .action(async (url: string, options: any = {}) => {
    try {
      // Set environment variables from options with defaults
      process.env.BROWSER_VIEWPORT_SIZE = options.viewport || "900x600"
      process.env.SCREENSHOT_QUALITY = (options.quality || 75).toString()
      process.env.REMOTE_BROWSER_ENABLED = options.remote ? "true" : "false"
      if (options.host) {
        process.env.REMOTE_BROWSER_HOST = options.host
      }

      const browser = new BrowserSession()
      await browser.launchBrowser()
      const result = await browser.navigateToUrl(url)
      
      console.log(chalk.green("✅ Browser launched successfully"))
      console.log(chalk.blue("Current URL:"), result.currentUrl)
      console.log(chalk.blue("Console logs:"), result.logs || "No logs")
      
      if (result.screenshot) {
        console.log(chalk.blue("Screenshot captured"))
        // You could save the screenshot to a file here
      }
    } catch (error) {
      console.error(chalk.red("❌ Error launching browser:"), error)
      process.exit(1)
    }
  })

// Click command
program
  .command("click")
  .description("Click at coordinates")
  .argument("<coordinates>", "Coordinates in format x,y")
  .action(async (coordinates: string, options: any = {}) => {
    try {
      const browser = new BrowserSession()
      const result = await browser.click(coordinates)
      
      console.log(chalk.green("✅ Clicked successfully"))
      console.log(chalk.blue("Console logs:"), result.logs || "No logs")
      
      if (result.screenshot) {
        console.log(chalk.blue("Screenshot captured"))
      }
    } catch (error) {
      console.error(chalk.red("❌ Error clicking:"), error)
      process.exit(1)
    }
  })

// Type command
program
  .command("type")
  .description("Type text")
  .argument("<text>", "Text to type")
  .action(async (text: string, options: any = {}) => {
    try {
      const browser = new BrowserSession()
      const result = await browser.type(text)
      
      console.log(chalk.green("✅ Typed successfully"))
      console.log(chalk.blue("Console logs:"), result.logs || "No logs")
      
      if (result.screenshot) {
        console.log(chalk.blue("Screenshot captured"))
      }
    } catch (error) {
      console.error(chalk.red("❌ Error typing:"), error)
      process.exit(1)
    }
  })

// Scroll command
program
  .command("scroll")
  .description("Scroll page")
  .argument("<direction>", "Scroll direction (up or down)")
  .action(async (direction: string, options: any = {}) => {
    try {
      const browser = new BrowserSession()
      const result = direction === "down" ? await browser.scrollDown() : await browser.scrollUp()
      
      console.log(chalk.green(`✅ Scrolled ${direction} successfully`))
      console.log(chalk.blue("Console logs:"), result.logs || "No logs")
      
      if (result.screenshot) {
        console.log(chalk.blue("Screenshot captured"))
      }
    } catch (error) {
      console.error(chalk.red("❌ Error scrolling:"), error)
      process.exit(1)
    }
  })

// Hover command
program
  .command("hover")
  .description("Hover at coordinates")
  .argument("<coordinates>", "Coordinates in format x,y")
  .action(async (coordinates: string, options: any = {}) => {
    try {
      const browser = new BrowserSession()
      const result = await browser.hover(coordinates)
      
      console.log(chalk.green("✅ Hovered successfully"))
      console.log(chalk.blue("Console logs:"), result.logs || "No logs")
      
      if (result.screenshot) {
        console.log(chalk.blue("Screenshot captured"))
      }
    } catch (error) {
      console.error(chalk.red("❌ Error hovering:"), error)
      process.exit(1)
    }
  })

// Resize command
program
  .command("resize")
  .description("Resize browser window")
  .argument("<size>", "Size in format width,height")
  .action(async (size: string, options: any = {}) => {
    try {
      const browser = new BrowserSession()
      const result = await browser.resize(size)
      
      console.log(chalk.green("✅ Resized successfully"))
      console.log(chalk.blue("Console logs:"), result.logs || "No logs")
      
      if (result.screenshot) {
        console.log(chalk.blue("Screenshot captured"))
      }
    } catch (error) {
      console.error(chalk.red("❌ Error resizing:"), error)
      process.exit(1)
    }
  })

// Close command
program
  .command("close")
  .description("Close browser")
  .action(async (options: any) => {
    try {
      const browser = new BrowserSession()
      await browser.closeBrowser()
      
      console.log(chalk.green("✅ Browser closed successfully"))
    } catch (error) {
      console.error(chalk.red("❌ Error closing browser:"), error)
      process.exit(1)
    }
  })

// Interactive mode command
program
  .command("interactive")
  .description("Start interactive mode")
  .action(async (options: any) => {
    console.log(chalk.yellow("🚀 Starting interactive browser automation mode"))
    console.log(chalk.gray("Type 'help' for available commands"))
    console.log(chalk.gray("Type 'exit' to quit"))
    
    const browser = new BrowserSession()
    let isLaunched = false
    
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const question = (query: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(query, resolve)
      })
    }
    
    while (true) {
      try {
        const input = await question(chalk.blue("browser> "))
        const [command, ...args] = input.trim().split(" ")
        
        switch (command?.toLowerCase()) {
          case "help":
            console.log(chalk.cyan("Available commands:"))
            console.log("  launch <url>     - Launch browser and navigate to URL")
            console.log("  click <x,y>      - Click at coordinates")
            console.log("  type <text>      - Type text")
            console.log("  scroll <up|down> - Scroll page")
            console.log("  hover <x,y>      - Hover at coordinates")
            console.log("  resize <w,h>     - Resize browser window")
            console.log("  close            - Close browser")
            console.log("  test             - Run connection test")
            console.log("  exit             - Exit interactive mode")
            break
            
          case "test":
            console.log(chalk.yellow("🧪 Running connection test..."))
            if (!isLaunched) {
              await browser.launchBrowser()
              isLaunched = true
            }
            const testResult = await browser.navigateToUrl("https://example.com")
            console.log(chalk.green("✅ Test successful"))
            console.log(chalk.blue("Current URL:"), testResult.currentUrl)
            break
            
          case "launch":
            if (args.length === 0) {
              console.log(chalk.red("❌ URL required"))
              break
            }
            if (!isLaunched) {
              await browser.launchBrowser()
              isLaunched = true
            }
            const result = await browser.navigateToUrl(args[0]!)
            console.log(chalk.green("✅ Navigated successfully"))
            console.log(chalk.blue("Current URL:"), result.currentUrl)
            break
            
          case "click":
            if (args.length === 0) {
              console.log(chalk.red("❌ Coordinates required (x,y format)"))
              break
            }
            await browser.click(args[0]!)
            console.log(chalk.green("✅ Clicked successfully"))
            break
            
          case "type":
            if (args.length === 0) {
              console.log(chalk.red("❌ Text required"))
              break
            }
            await browser.type(args.join(" "))
            console.log(chalk.green("✅ Typed successfully"))
            break
            
          case "scroll":
            if (args.length === 0 || !["up", "down"].includes(args[0]!)) {
              console.log(chalk.red("❌ Direction required (up or down)"))
              break
            }
            if (args[0] === "down") {
              await browser.scrollDown()
            } else {
              await browser.scrollUp()
            }
            console.log(chalk.green(`✅ Scrolled ${args[0]} successfully`))
            break
            
          case "hover":
            if (args.length === 0) {
              console.log(chalk.red("❌ Coordinates required (x,y format)"))
              break
            }
            await browser.hover(args[0]!)
            console.log(chalk.green("✅ Hovered successfully"))
            break
            
          case "resize":
            if (args.length === 0) {
              console.log(chalk.red("❌ Size required (width,height format)"))
              break
            }
            await browser.resize(args[0]!)
            console.log(chalk.green("✅ Resized successfully"))
            break
            
          case "close":
            await browser.closeBrowser()
            isLaunched = false
            console.log(chalk.green("✅ Browser closed"))
            break
            
          case "exit":
            if (isLaunched) {
              await browser.closeBrowser()
            }
            rl.close()
            console.log(chalk.yellow("👋 Goodbye!"))
            process.exit(0)
            break
            
          default:
            console.log(chalk.red(`❌ Unknown command: ${command}`))
            console.log(chalk.gray("Type 'help' for available commands"))
        }
      } catch (error) {
        console.error(chalk.red("❌ Error:"), error)
      }
    }
  })

// Test connection command
program
  .command("test-connection")
  .description("Test connection to Chrome browser (useful for dev containers)")
  .option("-p, --port <port>", "Chrome debugging port", "9222")
  .option("-h, --host <host>", "Specific host to test")
  .action(async (options: any = {}) => {
    try {
      const port = parseInt(options.port || "9222")
      const specificHost = options.host
      
      console.log(chalk.blue("🔍 Testing Chrome browser connection..."))
      console.log(chalk.gray(`Port: ${port}`))
      
      if (specificHost) {
        console.log(chalk.gray(`Testing specific host: ${specificHost}`))
        const { tryChromeHostUrl } = await import("./browser/browserDiscovery.js")
        const isValid = await tryChromeHostUrl(specificHost)
        
        if (isValid) {
          console.log(chalk.green(`✅ Successfully connected to ${specificHost}`))
        } else {
          console.log(chalk.red(`❌ Failed to connect to ${specificHost}`))
        }
        return
      }
      
      console.log(chalk.gray("Auto-discovering Chrome instances..."))
      const { discoverChromeHostUrl } = await import("./browser/browserDiscovery.js")
      const chromeHostUrl = await discoverChromeHostUrl(port)
      
      if (chromeHostUrl) {
        console.log(chalk.green(`✅ Auto-discovered and tested connection to Chrome: ${chromeHostUrl}`))
        console.log(chalk.blue("You can now use this host with:"))
        console.log(chalk.gray(`export REMOTE_BROWSER_HOST="${chromeHostUrl}"`))
        console.log(chalk.gray(`export REMOTE_BROWSER_ENABLED=true`))
      } else {
        console.log(chalk.red("❌ No Chrome instances found with remote debugging enabled"))
        console.log(chalk.yellow("\nTo start Chrome with remote debugging:"))
        console.log(chalk.gray("chrome --remote-debugging-port=9222"))
        console.log(chalk.gray("chromium --remote-debugging-port=9222"))
        console.log(chalk.gray("google-chrome --remote-debugging-port=9222"))
      }
    } catch (error) {
      console.error(chalk.red("❌ Error testing connection:"), error)
      process.exit(1)
    }
  })

// Dev containers command
program
  .command("dev-containers")
  .description("Setup and test browser automation for dev containers")
  .option("-p, --port <port>", "Chrome debugging port", "9222")
  .option("-h, --host <host>", "Host machine IP address")
  .action(async (options: any = {}) => {
    try {
      const port = parseInt(options.port || "9222")
      const hostIP = options.host
      
      console.log(chalk.blue("🐳 Dev Containers Browser Automation Setup"))
      console.log(chalk.gray("This will help you connect to Chrome running on your host machine"))
      
      // Test current connection
      console.log(chalk.yellow("\n1. Testing current connection..."))
      const { discoverChromeHostUrl } = await import("./browser/browserDiscovery.js")
      const chromeHostUrl = await discoverChromeHostUrl(port)
      
      if (chromeHostUrl) {
        console.log(chalk.green(`✅ Found Chrome at: ${chromeHostUrl}`))
      } else {
        console.log(chalk.red("❌ No Chrome found"))
        
        if (hostIP) {
          console.log(chalk.yellow(`\n2. Testing provided host: ${hostIP}:${port}`))
          const { tryChromeHostUrl } = await import("./browser/browserDiscovery.js")
          const testUrl = `http://${hostIP}:${port}`
          const isValid = await tryChromeHostUrl(testUrl)
          
          if (isValid) {
            console.log(chalk.green(`✅ Successfully connected to ${testUrl}`))
            console.log(chalk.blue("\n3. Environment variables to set:"))
            console.log(chalk.gray(`export REMOTE_BROWSER_HOST="${testUrl}"`))
            console.log(chalk.gray(`export REMOTE_BROWSER_ENABLED=true`))
          } else {
            console.log(chalk.red(`❌ Failed to connect to ${testUrl}`))
            console.log(chalk.yellow("\nTroubleshooting:"))
            console.log(chalk.gray("1. Make sure Chrome is running on host with --remote-debugging-port=9222"))
            console.log(chalk.gray("2. Check if the host IP is correct"))
            console.log(chalk.gray("3. Verify network connectivity between container and host"))
          }
        } else {
          console.log(chalk.yellow("\n2. To connect to host Chrome:"))
          console.log(chalk.gray("a) Start Chrome on host with remote debugging:"))
          console.log(chalk.gray("   chrome --remote-debugging-port=9222"))
          console.log(chalk.gray("b) Find your host IP address:"))
          console.log(chalk.gray("   ip addr show | grep inet"))
          console.log(chalk.gray("c) Run this command with your host IP:"))
          console.log(chalk.gray(`   browser-automation dev-containers --host YOUR_HOST_IP`))
        }
      }
      
      console.log(chalk.blue("\n4. Usage in dev containers:"))
      console.log(chalk.gray("# Set environment variables"))
      console.log(chalk.gray("export REMOTE_BROWSER_ENABLED=true"))
      console.log(chalk.gray("export REMOTE_BROWSER_HOST=http://HOST_IP:9222"))
      console.log(chalk.gray(""))
      console.log(chalk.gray("# Test the connection"))
      console.log(chalk.gray("browser-automation test-connection"))
      console.log(chalk.gray(""))
      console.log(chalk.gray("# Use browser automation"))
      console.log(chalk.gray("browser-automation launch https://example.com"))
      
    } catch (error) {
      console.error(chalk.red("❌ Error in dev containers setup:"), error)
      process.exit(1)
    }
  })

program.parse() 
