import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import styled from 'styled-components';

const TickerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const TickerSymbol = styled.span`
  font-size: 1.2rem;
`;

const TickerPrice = styled.span`
  font-size: 0.8rem;
`;

const colorsBySector = {
  technology: '#007bff',
  environment: '#28a745',
  energy: '#ffc107',
  // Add more sectors and colors as needed
};

const rosyColor = '#ff69b4'; // Define the rosy color

const StockTickerScroller = ({ onTickerClick, backgroundColor, color, scrollSpeed = 50 }) => {
  const [tickers, setTickers] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch('http://localhost:8500/api/stock-tickers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTickers(data);
      } catch (error) {
        console.error('Error fetching tickers:', error);
      }
    };

    fetchTickers();
  }, []);

  const roundPrice = (price) => {
    return price.toFixed(3);
  };

  const handleTickerClick = (ticker) => {
    if (selectedTicker === ticker) {
      setSelectedTicker(null); // Deselect if the same ticker is clicked again
    } else {
      setSelectedTicker(ticker); // Select the new ticker
      onTickerClick(ticker);
    }
  };

  return (
    <div style={{ backgroundColor, color, height: '90px', overflow: 'hidden' }} className="ticker-scroller">
      {tickers.length ? (
        <Marquee speed={scrollSpeed} pauseOnHover={true} play={selectedTicker === null} className="overflow-hidden">
          {tickers.map((ticker, index) => {
            const sectorColor = ticker.sector
              ? colorsBySector[ticker.sector.toLowerCase()] || 'white'
              : 'white';

            return (
              <TickerItem
                key={index}
                onClick={() => handleTickerClick(ticker.symbol)}
                style={{ color: selectedTicker === ticker.symbol ? rosyColor : sectorColor }}
              >
                <TickerSymbol>{ticker.symbol}</TickerSymbol>
                <hr style={{ width: '100%', margin: '2px 0' }} />
                <TickerPrice>{roundPrice(ticker.price)}</TickerPrice>
              </TickerItem>
            );
          })}
        </Marquee>
      ) : (
        <p>Loading tickers...</p>
      )}
    </div>
  );
};

export default StockTickerScroller;
