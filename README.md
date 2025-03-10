# Financial Budget Tracker

A comprehensive financial management application built with Next.js, TypeScript, Prisma, PostgreSQL, and more. This application helps users track their budget, visualize spending, and plan for the future.

## Features

- **User Authentication**: Secure login with email/password or social providers (Google, GitHub)
- **Transaction Management**: Track income and expenses with categorization
- **Budget Planning**: Create and manage budgets with category-based allocations
- **Savings Goals**: Set and track progress towards financial goals
- **Data Visualization**: Interactive charts and graphs to visualize financial data
- **Reporting**: Generate custom reports on spending and saving patterns
- **Forecasting**: Predict future financial trends based on historical data

## Tech Stack

- **Frontend & Backend**: Next.js with App Router
- **Database ORM**: Prisma
- **Database**: PostgreSQL (via Neon or Supabase)
- **Authentication**: NextAuth.js
- **State Management**: React Query + Context API/Zustand
- **Data Visualization**: D3.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database (local or cloud-based)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/financial-budget-tracker.git
   cd financial-budget-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection string and other environment variables

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main data models:

- **User**: User accounts and authentication
- **Transaction**: Income and expense records
- **Category**: Categories for transactions (income/expense)
- **Budget**: Budget plans with start/end dates
- **BudgetItem**: Individual category allocations within a budget
- **SavingsGoal**: Financial goals with target amounts and dates

## Deployment

This application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 