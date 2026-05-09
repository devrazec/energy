## Energy Dashboard

A modern, responsive energy monitoring dashboard built with Next.js 15 and React 19 that visualizes real-time energy production and consumption data. This application helps homeowners and building managers track their energy usage patterns, monitor solar production, and analyze consumption trends over various time periods.

## Features

- **Real-time Monitoring**: Track energy production and consumption with detailed charts and visualizations
- **Multiple Time Views**: Analyze data across different time periods:
  - Today, Tomorrow, Yesterday
  - Week and Month views
  - One Day, One Month, One Year detailed views
  - Grouped Day, Month, and Year aggregations
- **Interactive Charts**: Powered by ECharts with features including:
  - Multiple chart types (line, bar, stack, tiled)
  - Zoom and pan capabilities
  - Configurable time intervals (15min, 1h, 3h)
  - Export to image functionality
- **Forecast Integration**: View predicted energy production alongside actual data
- **Dark Mode**: Full dark/light theme support for comfortable viewing
- **Responsive Design**: Optimized layouts for desktop and mobile devices
- **Energy Metrics**: Track key statistics including:
  - Active power (kW)
  - Total energy consumption/production
  - Min/Max/Average values
  - Hour-by-hour breakdowns

## Technology Stack

- **Framework**: Next.js 15.5 with React 19
- **UI Library**: Material-UI (MUI) v9
- **Charts**: ECharts with React wrapper
- **Styling**: Emotion for CSS-in-JS
- **Date Handling**: Day.js with MUI Date Pickers
- **Deployment**: GitHub Pages via gh-pages

## Use Cases

- Monitor solar panel production efficiency
- Track household energy consumption patterns
- Compare forecasted vs actual energy generation
- Identify peak usage times
- Analyze energy trends over time
- Optimize energy usage based on production data 

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

### Build & Export

Build the application for production:

```bash
npm run build
```

This creates an optimized static export in the `out` directory.

### Deploy

Deploy to GitHub Pages:

```bash
npm run deploy
```

## Web Interface

- **Local**: http://localhost:3000
- **Demo**: https://devrazec.github.io/energy

## Project Structure

```
src/
├── app/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.js      # Main layout structure
│   │   ├── Top.js         # Header component
│   │   ├── Left.js        # Navigation sidebar
│   │   ├── Content.js     # Content area wrapper
│   │   └── Bottom.js      # Footer component
│   ├── pages/             # Page components for different views
│   │   ├── Today/         # Today's energy data
│   │   ├── Tomorrow/      # Tomorrow's forecast
│   │   ├── Week/          # Weekly overview
│   │   ├── Month/         # Monthly overview
│   │   ├── OneDay/        # Detailed single day view
│   │   ├── OneMonth/      # Detailed monthly view
│   │   ├── OneYear/       # Detailed yearly view
│   │   ├── GroupedDay/    # Aggregated daily data
│   │   ├── GroupedMonth/  # Aggregated monthly data
│   │   └── GroupedYear/   # Aggregated yearly data
│   ├── context/           # React context for global state
│   ├── hooks/             # Custom React hooks
│   └── data/              # JSON data files with energy measurements
```

## Data Format

The application uses JSON files containing energy measurements with the following structure:

- **Measurements**: Timestamped readings at different intervals (15min, 1h, 3h)
- **Production**: Solar panel or renewable energy generation data
- **Consumption**: Energy usage data
- **Forecast**: Predicted energy production
- **Metrics**: Active power (kW), total energy, min/max/avg values

## Screenshots
![Pic1](./public/screenshot/pic1.jpg)
![Pic2](./public/screenshot/pic2.jpg)
![Pic3](./public/screenshot/pic3.jpg)
![Pic4](./public/screenshot/pic4.jpg)
![Pic5](./public/screenshot/pic5.jpg)
![Pic6](./public/screenshot/pic6.jpg)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the dashboard.

## Repository

GitHub: [devrazec/energy](https://github.com/devrazec/energy)

## Example of Dashboard

https://help.energyid.eu/en/insights-reporting/create-your-own-dashboard/