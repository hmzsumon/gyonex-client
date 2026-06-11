// hooks/useBinanceTicker.ts
import { useEffect, useState } from "react";

interface TickerMessage {
  c?: string; // last price
  [key: string]: unknown;
}

export function useBinanceTicker(symbol?: string): string | null {
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    // নতুন symbol এলে আগের প্রাইস ক্লিয়ার করে দিচ্ছি
    setPrice(null);

    const streamName = `${symbol.toLowerCase()}@ticker`;
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`);

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as TickerMessage;
        if (data.c) {
          setPrice(data.c);
        }
      } catch (error) {
        console.error("Failed to parse ticker payload", error);
      }
    };

    ws.onerror = (error) => {
      console.error("Binance WS error", error);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return price;
}
