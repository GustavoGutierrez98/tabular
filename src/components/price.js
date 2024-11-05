import React, { useState, useEffect } from "react";
import axios from "axios";

const DollarPrice = () => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Replace with your chosen API's endpoint and your API key
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRate(response.data.rates.MXN); // Access MXN rate
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        setLoading(false);
      }
    };

    fetchExchangeRate();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading dollar price...</p>
      ) : (
        <p>Current Dollar Price in Mexico: ${exchangeRate} MXN</p>
      )}
    </div>
  );
};

export default DollarPrice;
