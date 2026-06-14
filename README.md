# CoinScope

CoinScope is a server-rendered cryptocurrency dashboard built with Express and EJS. It allows users to search for a cryptocurrency and view its current USD price, market capitalization, fully diluted valuation, trading volume, all-time high, all-time low, and 24-hour price change.

Market data and the cryptocurrency list are supplied by the CoinGecko API.

## Features

- Searchable cryptocurrency list
- Current market data for the selected coin
- Positive and negative 24-hour change indicators
- Null-safe handling for unavailable market values
- Separate messages for invalid coins, API rate limits, network failures, and upstream errors
- Responsive layout for desktop and mobile screens
- Custom CoinScope logo and favicon

## Technologies

- Node.js
- Express
- EJS
- Axios
- CoinGecko API
- HTML and CSS

## Requirements

Install the following before running the project:

- Node.js 18 or newer
- npm

## Setup

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   ```

2. Enter the project directory:

   ```bash
   cd crypto-dash
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the application:

   ```text
   http://localhost:3000
   ```

## Usage

Enter or select a CoinGecko coin ID in the search field and click **View Coin**. For example:

- `bitcoin`
- `ethereum`
- `ripple`
- `solana`

Coin names and symbols may differ from their CoinGecko IDs. The suggestions in the search field provide the correct IDs.

## Project Structure

```text
crypto-dash/
|-- public/
|   |-- image/
|   |   |-- cs-logo.png
|   |   `-- cs-logo-source.png
|   `-- styles/
|       `-- main.css
|-- views/
|   `-- index.ejs
|-- index.js
|-- package.json
`-- README.md
```

## Error Handling

The dashboard displays different messages when:

- A coin has no available market data
- CoinGecko's rate limit is reached
- CoinGecko returns an upstream error
- The network or market data service cannot be reached
- An unexpected application error occurs

## Data Attribution

Cryptocurrency data is provided by [CoinGecko](https://www.coingecko.com/en/api). Prices and other market values may be delayed or unavailable for some assets.

## Current Limitations

- The project uses CoinGecko's public API and may encounter rate limits.
- The full coin list is loaded when the server starts.
- Historical charts and persistent user preferences are not currently included.