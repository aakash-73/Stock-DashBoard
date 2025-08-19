import React, { useEffect, useState } from "react";
import StockTable from "./StockTable";
import StockChart from "./StockChart";
import Papa from "papaparse";

function App() {
  const [stocks, setStocks] = useState([]);
  const [history, setHistory] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [selected, setSelected] = useState("AAPL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_ALPHA_API_KEY; 

  useEffect(() => {
    console.log("Loading CSV...");
    Papa.parse("/sp500.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const list = result.data.map((r) => r.Symbol).filter(Boolean);
        console.log("Symbols loaded:", list);
        setSymbols(list);
        if (list.length > 0) setSelected(list[0]);
      },
      error: (err) => {
        console.error("CSV load error:", err);
        setError("Failed to load symbols CSV");
        setLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    if (symbols.length === 0) return;

    async function fetchData() {
      try {
        setLoading(true);
        console.log("Fetching stock data for symbols:", symbols);

        const results = await Promise.all(
          symbols.slice(0, 1).map(async (sym) => {
            try {
              const res = await fetch(
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${API_KEY}`
              );
              const data = await res.json();
              console.log("Global Quote response for", sym, data);

              const q = data["Global Quote"] || {};
              return {
                symbol: sym,
                price: q["05. price"] || "N/A",
                change: q["09. change"] || "0",
                changePercent: q["10. change percent"] || "0%",
              };
            } catch (err) {
              console.error("Failed fetching symbol:", sym, err);
              return { symbol: sym, price: "Error", change: "0", changePercent: "0%" };
            }
          })
        );

        setStocks(results);
        console.log("Stocks set:", results);

        try {
          const resHist = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${selected}&apikey=${API_KEY}`
          );
          const histData = await resHist.json();
          console.log("History response for", selected, histData);

          const daily = histData["Time Series (Daily)"] || {};
          const parsed = Object.entries(daily).map(([date, val]) => ({
            date,
            price: parseFloat(val["4. close"]),
          }));
          setHistory(parsed.slice(0, 10));
          console.log("History set:", parsed.slice(0, 10));
        } catch (err) {
          console.error("Failed fetching history:", err);
          setHistory([]);
        }
      } catch (err) {
        console.error("Failed to load stock data:", err);
        setError("Failed to load stock data");
      } finally {
        setLoading(false);
        console.log("Loading finished");
      }
    }

    fetchData();
  }, [symbols, selected, API_KEY]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">📈 Stock Dashboard</h1>

      <StockTable stocks={stocks} />

      <div className="mt-6">
        <label className="mr-2 font-semibold">Select Symbol:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {symbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <StockChart history={history} symbol={selected} />
    </div>
  );
}

export default App;
