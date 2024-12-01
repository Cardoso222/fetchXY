# FetchXY

FetchXY is a lightweight and flexible HTTP client for TypeScript/JavaScript applications, providing a simple interface for making HTTP requests with built-in timeout handling, retries, and error management.

## Features

- 🚀 Promise-based HTTP client
- ⚡ Automatic timeout handling
- 🔄 Request retries
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
import { FetchXY } from 'fetch-xy';

const client = new FetchXY();

// Making a GET request
const response = await client.get('https://api.example.com/data');

// Making a POST request
const postResponse = await client.post('https://api.example.com/data', {
  data: {
    name: 'John Doe',
    email: 'john@example.com'
  }
});
```

### Configuration

```typescript
const client = new FetchXY({
  timeout: 5000, // 5 seconds
  retries: 3,
  headers: {
    'Authorization': 'Bearer your-token'
  }
});
```

### Available Methods

- `get(url, config)`
- `post(url, config)`
- `put(url, config)`
- `delete(url, config)`

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