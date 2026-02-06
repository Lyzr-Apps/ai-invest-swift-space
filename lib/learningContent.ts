/**
 * StockAI Learning Hub Content
 * Structured educational tracks for students and professionals
 */

import { LearningTrack } from './types'

export const learningTracks: Record<string, LearningTrack> = {
  beginner: {
    name: 'Beginner Track',
    description: 'Start your investing journey with the fundamentals',
    lessons: [
      {
        id: 'what-are-stocks',
        title: 'What Are Stocks?',
        duration: '5 min',
        difficulty: 'Beginner',
        content: `Stocks represent ownership in a company. When you buy a stock, you become a shareholder and own a small piece of that business.

**Why Companies Issue Stocks:**
Companies sell stocks to raise capital for growth, expansion, research, or paying off debt. Instead of borrowing money, they sell ownership stakes to investors.

**How Stock Prices Work:**
Stock prices are determined by supply and demand in the market. If more people want to buy a stock than sell it, the price goes up. If more want to sell than buy, it goes down.

**Market Capitalization:**
This is the total value of all a company's shares. It's calculated by multiplying the stock price by the number of shares outstanding. For example, if a company has 1 billion shares trading at $100 each, its market cap is $100 billion.`,
        keyPoints: [
          'Stocks = ownership in a company',
          'Prices driven by supply and demand',
          'Market cap = stock price × total shares',
          'Shareholders may receive dividends (profit sharing)'
        ],
        interactiveExample: 'AAPL',
        relatedStocks: ['AAPL', 'MSFT', 'GOOGL']
      },
      {
        id: 'understanding-stock-prices',
        title: 'Understanding Stock Prices',
        duration: '7 min',
        difficulty: 'Beginner',
        content: `Stock prices fluctuate constantly during market hours based on several factors:

**Supply and Demand:**
The fundamental driver. More buyers = price rises. More sellers = price falls.

**Company Performance:**
Earnings reports, revenue growth, new products, and management changes all impact investor confidence and therefore stock prices.

**Market Sentiment:**
General market conditions, economic indicators, and investor psychology affect all stocks. A strong economy typically lifts stock prices.

**External Events:**
News, regulations, competitor actions, industry trends, and global events can cause rapid price changes.

**Price Changes:**
Stocks show daily change in dollars (+$2.50) and percentage (+1.25%). Percentage is more meaningful for comparison across different-priced stocks.`,
        keyPoints: [
          'Prices change based on supply/demand balance',
          'Company news directly impacts stock value',
          'Market sentiment affects all stocks',
          'Use percentages to compare price movements'
        ],
        interactiveExample: 'TSLA',
        relatedStocks: ['TSLA', 'NVDA', 'META']
      },
      {
        id: 'how-to-read-stock-chart',
        title: 'How to Read a Stock Chart',
        duration: '10 min',
        difficulty: 'Beginner',
        content: `Stock charts visualize price movements over time, helping you identify trends and patterns.

**Candlestick Charts:**
Each "candle" shows four prices for a time period:
- **Open:** Price at period start
- **Close:** Price at period end
- **High:** Highest price reached
- **Low:** Lowest price reached

Green/white candles mean the price closed higher than it opened (bullish). Red/black candles mean it closed lower (bearish).

**Trends:**
- **Uptrend:** Series of higher highs and higher lows (bullish)
- **Downtrend:** Series of lower highs and lower lows (bearish)
- **Sideways:** Price moves in a range without clear direction

**Volume:**
Shown as bars below the price chart. High volume confirms strong trends. Low volume suggests weak conviction.

**Timeframes:**
Charts can show different periods: 1 day, 1 week, 1 month, 1 year, 5 years, etc. Longer timeframes show overall trends; shorter ones show recent volatility.`,
        keyPoints: [
          'Candlesticks show open, close, high, low prices',
          'Green = bullish, Red = bearish',
          'Identify uptrends, downtrends, sideways movement',
          'Volume confirms trend strength'
        ],
        interactiveExample: 'AAPL',
        relatedStocks: ['AAPL', 'AMZN', 'NVDA']
      },
      {
        id: 'risk-vs-reward',
        title: 'Risk vs Reward',
        duration: '8 min',
        difficulty: 'Beginner',
        content: `All investments carry risk. Understanding and managing risk is crucial for long-term success.

**Volatility:**
This measures how much a stock's price fluctuates. High volatility = higher risk but also higher potential returns. Low volatility = more stable but slower growth.

**Diversification:**
Don't put all your money in one stock. Spread investments across different companies, sectors, and asset types to reduce risk. If one investment performs poorly, others may offset the loss.

**Risk Tolerance:**
This is your personal comfort with uncertainty. Consider:
- Your age (younger = can take more risk)
- Financial goals (retirement, home purchase, etc.)
- Time horizon (when you'll need the money)
- Emotional capacity (can you sleep at night with market swings?)

**Risk Management Strategies:**
- Invest only what you can afford to lose
- Set stop-loss orders to limit potential losses
- Regularly rebalance your portfolio
- Don't invest borrowed money
- Keep emergency savings separate

**Expected Returns:**
Higher risk should come with higher potential returns. Government bonds are low risk/low return. Individual stocks are higher risk/higher potential return. Understand what you're getting into.`,
        keyPoints: [
          'Volatility = price fluctuation = risk level',
          'Diversify to spread and reduce risk',
          'Match investments to your risk tolerance',
          'Never invest more than you can afford to lose'
        ],
        interactiveExample: 'TSLA',
        relatedStocks: ['TSLA', 'NVDA', 'AAPL']
      }
    ]
  },

  intermediate: {
    name: 'Intermediate Track',
    description: 'Dive deeper into analysis techniques and indicators',
    lessons: [
      {
        id: 'technical-indicators-explained',
        title: 'Technical Indicators Explained',
        duration: '12 min',
        difficulty: 'Intermediate',
        content: `Technical indicators use historical price and volume data to predict future movements.

**RSI (Relative Strength Index):**
Measures momentum on a 0-100 scale.
- RSI > 70: Potentially overbought (may drop)
- RSI < 30: Potentially oversold (may rise)
- RSI 30-70: Neutral zone

**MACD (Moving Average Convergence Divergence):**
Shows relationship between two moving averages.
- **Bullish crossover:** MACD line crosses above signal line
- **Bearish crossover:** MACD line crosses below signal line
- Divergence from price can signal trend reversals

**Moving Averages:**
Average price over a set period (e.g., 50-day, 200-day).
- Price above MA = bullish signal
- Price below MA = bearish signal
- "Golden Cross": 50-day MA crosses above 200-day MA (very bullish)
- "Death Cross": 50-day MA crosses below 200-day MA (very bearish)

**Using Multiple Indicators:**
Never rely on one indicator. Look for confirmation across multiple signals. For example: RSI shows oversold + MACD bullish crossover + price above 50-day MA = strong buy signal.`,
        keyPoints: [
          'RSI measures overbought/oversold conditions',
          'MACD shows momentum shifts via crossovers',
          'Moving averages reveal trend direction',
          'Combine indicators for stronger signals'
        ],
        interactiveExample: 'AAPL',
        relatedStocks: ['AAPL', 'MSFT', 'GOOGL'],
        formulaExamples: [
          'RSI = 100 - (100 / (1 + RS))',
          'RS = Average Gain / Average Loss',
          'MACD = 12-day EMA - 26-day EMA'
        ]
      },
      {
        id: 'fundamental-analysis-101',
        title: 'Fundamental Analysis 101',
        duration: '15 min',
        difficulty: 'Intermediate',
        content: `Fundamental analysis evaluates a company's intrinsic value by examining financial health and business performance.

**P/E Ratio (Price-to-Earnings):**
Stock price divided by earnings per share. Shows how much investors pay for $1 of earnings.
- High P/E: Stock may be overvalued OR market expects strong growth
- Low P/E: Stock may be undervalued OR company has problems
- Compare to sector average for context

**EPS (Earnings Per Share):**
Company's profit divided by outstanding shares. Higher is better. Track growth over time.

**Debt-to-Equity Ratio:**
Total debt divided by shareholder equity. Measures financial leverage.
- < 1.0: More equity than debt (safer)
- > 2.0: Heavily leveraged (risky but potentially higher returns)
- Varies by industry (utilities typically have higher ratios)

**Revenue Growth:**
Year-over-year increase in sales. Consistent growth shows healthy business expansion.

**Profit Margins:**
Percentage of revenue kept as profit. Higher margins = more efficient operations.

**Valuation:**
Combine metrics to determine if a stock is fairly valued, undervalued, or overvalued relative to its fundamentals.`,
        keyPoints: [
          'P/E ratio shows valuation vs earnings',
          'EPS measures per-share profitability',
          'Debt-to-equity indicates financial risk',
          'Growth rates reveal business momentum'
        ],
        interactiveExample: 'MSFT',
        relatedStocks: ['MSFT', 'AAPL', 'GOOGL'],
        formulaExamples: [
          'P/E Ratio = Stock Price / Earnings Per Share',
          'EPS = Net Income / Shares Outstanding',
          'Debt-to-Equity = Total Debt / Shareholder Equity'
        ]
      },
      {
        id: 'reading-financial-statements',
        title: 'Reading Financial Statements',
        duration: '18 min',
        difficulty: 'Intermediate',
        content: `Public companies release quarterly and annual financial statements. Understanding these reveals company health.

**Income Statement:**
Shows profitability over a period.
- **Revenue:** Total sales
- **Cost of Goods Sold (COGS):** Direct costs to produce products/services
- **Gross Profit:** Revenue - COGS
- **Operating Expenses:** Salaries, marketing, R&D, etc.
- **Operating Income:** Gross Profit - Operating Expenses
- **Net Income:** Final profit after all expenses and taxes

**Balance Sheet:**
Snapshot of assets, liabilities, and equity at a point in time.
- **Assets:** What the company owns (cash, inventory, property)
- **Liabilities:** What the company owes (debt, accounts payable)
- **Shareholder Equity:** Assets - Liabilities (company's net worth)

**Cash Flow Statement:**
Shows actual cash moving in and out.
- **Operating Cash Flow:** Cash from core business
- **Investing Cash Flow:** Capital expenditures, acquisitions
- **Financing Cash Flow:** Debt, equity, dividends

**Key Ratios from Statements:**
- Current Ratio = Current Assets / Current Liabilities (liquidity)
- Return on Equity (ROE) = Net Income / Shareholder Equity (efficiency)
- Free Cash Flow = Operating Cash Flow - Capital Expenditures (available cash)

**Red Flags:**
- Declining revenue
- Negative cash flow
- Rising debt without corresponding growth
- Inconsistent earnings`,
        keyPoints: [
          'Income statement shows profitability',
          'Balance sheet shows financial position',
          'Cash flow statement reveals cash health',
          'Calculate ratios for deeper insights'
        ],
        interactiveExample: 'AAPL',
        relatedStocks: ['AAPL', 'AMZN', 'META']
      },
      {
        id: 'sector-analysis',
        title: 'Sector Analysis',
        duration: '12 min',
        difficulty: 'Intermediate',
        content: `Understanding sector dynamics helps contextualize individual stock performance.

**What is a Sector?**
A group of companies in the same industry. The 11 major sectors are:
1. Technology (AAPL, MSFT, GOOGL)
2. Healthcare (JNJ, UNH, PFE)
3. Financials (JPM, BAC, V)
4. Consumer Discretionary (AMZN, TSLA, NKE)
5. Communication Services (META, DIS, NFLX)
6. Industrials (BA, CAT, GE)
7. Consumer Staples (WMT, PG, KO)
8. Energy (XOM, CVX)
9. Utilities (NEE, DUK)
10. Real Estate (AMT, PLD)
11. Materials (LIN, APD)

**Sector Rotation:**
Money flows between sectors based on economic cycles:
- **Early Recovery:** Technology, Consumer Discretionary
- **Mid Expansion:** Industrials, Materials
- **Late Cycle:** Energy, Financials
- **Recession:** Consumer Staples, Healthcare, Utilities

**Peer Comparison:**
Compare a stock to sector competitors:
- Relative performance vs sector index
- Market share trends
- Competitive advantages
- Innovation leadership

**Sector Trends:**
Industry-wide shifts affect all companies:
- Technology: AI adoption, cloud computing
- Healthcare: Aging population, drug approvals
- Energy: Renewable transition, oil prices

**Why It Matters:**
A great company in a declining sector may underperform. A mediocre company in a booming sector may excel. Context is critical.`,
        keyPoints: [
          '11 major stock market sectors',
          'Sector rotation follows economic cycles',
          'Compare stocks to sector peers',
          'Industry trends impact all sector stocks'
        ],
        interactiveExample: 'AAPL',
        relatedStocks: ['AAPL', 'MSFT', 'GOOGL', 'NVDA']
      }
    ]
  },

  advanced: {
    name: 'Advanced Track',
    description: 'Master sophisticated strategies and AI-driven insights',
    lessons: [
      {
        id: 'ai-driven-investing',
        title: 'AI-Driven Investing',
        duration: '20 min',
        difficulty: 'Advanced',
        content: `AI transforms stock analysis by processing vast datasets faster and more objectively than humans.

**How AI Analyzes Stocks:**
1. **Data Aggregation:** Collects real-time data from exchanges, news, social media, earnings reports
2. **Pattern Recognition:** Identifies trends, correlations, and anomalies across millions of data points
3. **Sentiment Analysis:** Processes news articles, analyst reports, social sentiment to gauge market mood
4. **Predictive Modeling:** Uses historical patterns to forecast potential price movements
5. **Risk Assessment:** Calculates volatility, correlation, and portfolio risk metrics

**StockAI's Approach:**
- **Technical Analysis Agent:** RSI, MACD, moving averages, volume trends
- **Fundamental Analysis Agent:** P/E ratios, debt levels, earnings growth, financial health
- **News Sentiment Agent:** Article analysis with sentiment scores and impact ratings
- **Sector Trends Agent:** Peer comparisons, industry trends, sector rotation signals
- **Coordinator Agent:** Synthesizes all analyses into unified verdict with confidence levels

**Advantages of AI:**
- Processes information 24/7 without fatigue
- No emotional bias or fear/greed
- Identifies subtle correlations humans miss
- Provides data-grounded explanations for every decision

**Limitations:**
- AI can't predict black swan events (COVID, wars, etc.)
- Historical patterns may not repeat
- Models require regular updates as markets evolve
- Should complement, not replace, human judgment

**Responsible AI Investing:**
- Verify AI recommendations with your own research
- Understand the data sources behind AI conclusions
- Don't blindly follow any system
- Use AI as a tool for informed decision-making`,
        keyPoints: [
          'AI processes vast data faster than humans',
          'Multi-agent systems analyze different aspects',
          'AI removes emotional bias from decisions',
          'Always verify AI recommendations independently'
        ],
        interactiveExample: 'NVDA',
        relatedStocks: ['NVDA', 'MSFT', 'GOOGL', 'META']
      },
      {
        id: 'portfolio-construction',
        title: 'Portfolio Construction',
        duration: '22 min',
        difficulty: 'Advanced',
        content: `Building a well-balanced portfolio requires strategic asset allocation and ongoing management.

**Asset Allocation:**
Distribute investments across different asset classes:
- **Stocks (Equities):** Growth potential, higher volatility
- **Bonds (Fixed Income):** Stability, regular income
- **Cash/Cash Equivalents:** Liquidity, safety
- **Alternative Assets:** Real estate, commodities, crypto (optional)

**Rule of Thumb:**
Stock allocation = 110 - Your Age
Example: 30-year-old = 80% stocks, 20% bonds/cash
Adjust based on risk tolerance.

**Diversification Strategy:**
- **Sector Diversification:** Don't overweight one industry (e.g., all tech stocks)
- **Market Cap Diversification:** Mix large-cap, mid-cap, small-cap stocks
- **Geographic Diversification:** Include international exposure
- **Style Diversification:** Blend growth and value stocks

**Position Sizing:**
How much to invest in each stock:
- No single stock > 5-10% of portfolio (reduces concentration risk)
- High-conviction picks can be larger positions
- Riskier stocks should be smaller positions

**Rebalancing:**
Periodically adjust to maintain target allocation:
- **Time-based:** Quarterly or annually
- **Threshold-based:** When allocation drifts >5% from target
- Rebalancing forces you to "sell high, buy low"

**Sample Portfolio (Moderate Risk):**
- 60% Stocks (15% large-cap growth, 15% large-cap value, 15% mid-cap, 10% small-cap, 5% international)
- 30% Bonds (Mix of government and corporate)
- 10% Cash

**Tax Efficiency:**
- Hold long-term positions in taxable accounts (lower capital gains tax)
- Place high-turnover trades in tax-advantaged accounts (IRA, 401k)
- Tax-loss harvest to offset gains`,
        keyPoints: [
          'Asset allocation matches age and risk tolerance',
          'Diversify across sectors, caps, geographies',
          'No position should dominate portfolio',
          'Rebalance regularly to maintain targets'
        ],
        interactiveExample: 'AAPL',
        relatedStocks: ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META']
      },
      {
        id: 'risk-management-strategies',
        title: 'Risk Management Strategies',
        duration: '18 min',
        difficulty: 'Advanced',
        content: `Protecting capital is as important as generating returns. Advanced risk management techniques preserve wealth during downturns.

**Stop-Loss Orders:**
Automatically sells if stock drops to specified price.
- **Fixed Stop:** Sell if drops to $50 (absolute price)
- **Trailing Stop:** Sell if drops 10% from peak (percentage-based)
- Prevents emotional decision-making during crashes
- Lock in gains as stocks rise

**Position Sizing Rules:**
- **Fixed Dollar Amount:** Same $ amount per position
- **Percentage of Portfolio:** 5% max per stock
- **Volatility-Adjusted:** Smaller positions in volatile stocks
- **Kelly Criterion:** Mathematical formula based on edge and odds (advanced)

**Hedging Strategies:**
- **Options:** Buy protective puts to limit downside
- **Inverse ETFs:** Profit from market declines (short-term hedge)
- **Sector Rotation:** Shift to defensive sectors during uncertainty
- **Correlation:** Hold negatively correlated assets (gold, bonds during stock crashes)

**Volatility Management:**
- **VIX Monitoring:** "Fear index" - rising VIX = market stress
- **Beta:** Measure of stock volatility vs market (Beta > 1 = more volatile)
- Reduce exposure when volatility spikes
- Increase cash holdings during extreme uncertainty

**Risk/Reward Ratio:**
Only take trades where potential reward > risk.
- Target 2:1 or 3:1 reward/risk minimum
- If risking $500 on stop-loss, target $1000-1500 profit
- Skip trades that don't meet criteria

**Scenario Analysis:**
Always ask "What if I'm wrong?":
- Best case scenario
- Expected scenario
- Worst case scenario
- Define exit strategies for each

**Psychological Risk Management:**
- Never invest with borrowed money
- Size positions so you can sleep at night
- Take breaks from watching market
- Accept that losses are part of investing`,
        keyPoints: [
          'Stop-losses prevent catastrophic losses',
          'Size positions based on risk tolerance',
          'Use hedging during market uncertainty',
          'Only take trades with favorable risk/reward'
        ],
        interactiveExample: 'TSLA',
        relatedStocks: ['TSLA', 'NVDA', 'AAPL', 'AMZN']
      },
      {
        id: 'market-psychology',
        title: 'Market Psychology',
        duration: '16 min',
        difficulty: 'Advanced',
        content: `Understanding investor psychology and behavioral finance helps avoid common mistakes and exploit market inefficiencies.

**Fear and Greed Cycle:**
Markets oscillate between extremes:
- **Greed Phase:** Overconfidence, FOMO, buying frenzies, valuations stretch
- **Fear Phase:** Panic selling, capitulation, undervaluation

**Behavioral Biases:**

1. **Confirmation Bias:** Seeking info that confirms existing beliefs. Investors ignore negative news about stocks they own.

2. **Herd Mentality:** Following the crowd. Leads to bubbles (everyone buying) and crashes (everyone selling).

3. **Loss Aversion:** Fear of losses outweighs desire for gains. Causes selling winners too early, holding losers too long.

4. **Anchoring:** Fixating on initial price. "It was $100, now $50, must be cheap!" (ignoring fundamentals changed).

5. **Recency Bias:** Overweighting recent events. "Stock's up 3 months, will keep rising!" (ignoring long-term trends).

**Sentiment Indicators:**
- **Put/Call Ratio:** High ratio = fear, low = complacency
- **CNN Fear & Greed Index:** Composite measure of market emotion
- **Social Media Sentiment:** Twitter/Reddit buzz (contrarian indicator at extremes)
- **Short Interest:** Heavy shorting can signal pessimism (or smart money)

**Contrarian Investing:**
"Be fearful when others are greedy, greedy when others are fearful" - Warren Buffett
- Buy during panic (2008, 2020 March)
- Sell during euphoria (Dot-com bubble, crypto peaks)
- Requires conviction and patience

**News Sentiment Analysis:**
StockAI analyzes how news affects stocks:
- **Positive Sentiment:** Upgrades, earnings beats, product launches
- **Negative Sentiment:** Downgrades, misses, lawsuits, scandals
- **Impact Rating:** High impact moves markets, low impact is noise

**Managing Your Psychology:**
- Create investment plan when calm, follow it when emotional
- Use checklists to avoid impulsive decisions
- Journal trades to learn from mistakes
- Accept that perfect timing is impossible
- Focus on process, not outcomes

**Market Stages:**
1. **Accumulation:** Smart money buying after crash
2. **Markup:** Public participation, rising prices
3. **Distribution:** Smart money selling to late buyers
4. **Markdown:** Panic selling, price collapse

Identify which stage the market is in to adjust strategy.`,
        keyPoints: [
          'Fear and greed drive market cycles',
          'Recognize and counter your own biases',
          'Use sentiment indicators as contrarian signals',
          'Follow a plan to avoid emotional decisions'
        ],
        interactiveExample: 'TSLA',
        relatedStocks: ['TSLA', 'AAPL', 'NVDA', 'META']
      }
    ]
  }
}

export function getAllLessons() {
  const allLessons = []
  for (const track of Object.values(learningTracks)) {
    allLessons.push(...track.lessons)
  }
  return allLessons
}

export function getLessonById(id: string) {
  const allLessons = getAllLessons()
  return allLessons.find(lesson => lesson.id === id)
}
