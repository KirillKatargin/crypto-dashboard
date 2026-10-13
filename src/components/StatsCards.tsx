export function StatsCards() {
  return (
    <section className="stats">
      <div>
        <span>Total market cap</span>
        <strong>$2.48T</strong>
        <em className="up">+2.14%</em>
      </div>
      <div>
        <span>24h volume</span>
        <strong>$87.6B</strong>
        <em className="up">+8.62%</em>
      </div>
      <div>
        <span>BTC dominance</span>
        <strong>52.8%</strong>
        <em className="down">−0.31%</em>
      </div>
      <div>
        <span>Active assets</span>
        <strong>12,482</strong>
        <em className="neutral">+124 today</em>
      </div>
    </section>
  );
}
