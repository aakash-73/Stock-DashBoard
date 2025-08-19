import React from "react";

export default function StockTable({ stocks }) {
  return (
    <div className="overflow-x-auto w-full mt-6">
      <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Change</th>
            <th className="px-4 py-2">Change %</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={s.symbol} className="text-center border-t">
              <td className="px-4 py-2 font-semibold">{s.symbol}</td>
              <td className="px-4 py-2">${s.price}</td>
              <td className={`px-4 py-2 ${parseFloat(s.change) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {s.change}
              </td>
              <td className="px-4 py-2">{s.changePercent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
