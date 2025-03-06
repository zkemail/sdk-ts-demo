# sdk-ts-demo

Demo of using the typescript zk-email sdk

## Prerequisites

### Node.js Requirements
This project requires Node.js version 20 or above. We recommend using `nvm` (Node Version Manager) to manage your Node.js versions.

#### Installing nvm and Node.js
1. Install nvm:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. Restart your terminal and verify nvm installation:
   ```bash
   nvm --version
   ```

3. Install and use Node.js v20:
   ```bash
   nvm install 20
   nvm use 20
   ```

## Project Demos

### Node.js Demo
This demo requires [bun](https://bun.sh) to run:

```bash
# Navigate to the Node.js demo directory
cd node_js

# Install dependencies
bun i

# Run the demo
bun src/shortest-example.ts
```

### Deno Demo
Make sure you have [Deno](https://deno.land) installed.

```bash
# Navigate to the Deno demo directory
cd deno

# Run the development server
deno task dev
```

### NextJS Demo
```bash
# Navigate to the NextJS demo directory
cd nextjs

# Install dependencies
pnpm i

# Start the development server
pnpm run dev
```

### Vite Vanilla JS Demo
```bash
# Navigate to the Vite demo directory
cd vite

# Install dependencies
pnpm i

# Start the development server
pnpm run dev
```

## Additional Notes
- Each demo is contained in its own directory with its specific dependencies
- Make sure to install the required package managers before running the respective demos:
  
  Install bun:
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
  
  Install pnpm:
  ```bash
  npm install -g pnpm
  ```

- For the best development experience, ensure you're using the latest stable versions of all tools
