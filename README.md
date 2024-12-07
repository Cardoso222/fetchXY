# FetchXY

FetchXY is a lightweight and flexible HTTP client for TypeScript/JavaScript applications, providing a simple interface for making HTTP requests with built-in timeout handling, retries, and error management.

## Features

- 🚀 Promise-based HTTP client
- ⚡ Automatic timeout handling
- 🔄 Request retries with configurable conditions
- 📦 TypeScript support
- 🛠 Configurable defaults
- 🎯 Simple and intuitive API

## Installation

```bash
npm install fetch-xy
```

## Usage

### Basic Example

```typescript
import FetchXY from 'fetch-xy';

const client = new FetchXY();

// Make a GET request
const response = await client.get('https://api.github.com/users/octocat');
console.log(response);
// Response will include:
// {
//   data: { ... },        // Response data
//   status: 200,          // HTTP status code
//   success: true,        // Boolean indicating if status is 2xx
//   headers: { ... },     // Response headers
//   attempts: 0,          // Number of retry attempts made
//   retries: 0,          // Total retries configured
//   retryDelay: 1000     // Delay between retries in ms
// }

// Make a request with retries
const responseWithRetries = await client.get('https://api.github.com/users/octocat', {
  retries: 3,             // Retry up to 3 times
  timeout: 5000,          // Timeout after 5 seconds
  retryDelay: 1000,       // Wait 1 second between retries
  retryIf: [408, 500]     // Only retry on timeout or server error
});
```

### Advanced Configuration

```typescript
const client = new FetchXY({
  // Default timeout of 5 seconds
  timeout: 5000,
  
  // Retry failed requests up to 3 times
  retries: 3,
  
  // Wait 2 seconds between retries
  retryDelay: 2000,
  
  // Retry on specific HTTP status codes
  retryIf: [408, 500, 502, 503, 504],
  
  // Default headers
  headers: {
    'Authorization': 'Bearer your-token'
  }
});
```

### Retry Configuration Examples

```typescript
// Retry only on timeout (408) and server errors (500)
const client = new FetchXY({
  retries: 2,
  retryIf: [408, 500]
});

// Custom retry delay with specific status codes
const response = await client.get('https://api.example.com/data', {
  retries: 3,
  retryDelay: 1000, // 1 second between retries
  retryIf: [503, 504] // Retry only on service unavailable
});

// Timeout configuration
const response = await client.post('https://api.example.com/data', {
  timeout: 3000, // 3 second timeout
  retries: 2,    // Retry twice if timeout occurs
  data: {
    name: 'John Doe'
  }
});
```

### Available Methods

- `get(url, config)`
- `post(url, config)`
- `put(url, config)`
- `delete(url, config)`
- `patch(url, config)`

## Development

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Setting Up the Development Environment

1. Clone the repository:

```bash
git clone https://github.com/cardoso222/FetchXY.git
cd FetchXY
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Write clear and descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style
- Make sure all tests pass before submitting a PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.