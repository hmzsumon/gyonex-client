'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import baseUrl from '@/config/baseUrl';

interface TickerData {
	h: string;
	l: string;
	v: string;
	c: string;
	o: string;
	s: string;
	e: string;
	E: string;
	q: string;
	p: string;
	P: string;
	w: string;
	x: string;
	X: string;
	b: string;
	B: string;
	a: string;
	A: string;
	O: string;
	Q: string;
}

interface TickerContextValue {
	ticker: TickerData | null;
}

const TickerContext = createContext<TickerContextValue | undefined>(undefined);

export const useTickerContext = () => {
	const context = useContext(TickerContext);
	if (!context) {
		throw new Error('useTickerContext must be used within a TickerProvider');
	}
	return context;
};

export const TickerProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { symbol } = useSelector((state: any) => state.trade);
	const [ticker, setTicker] = useState<TickerData | null>(null);

	useEffect(() => {
		// Create a Socket.IO connection
		const socket = io(baseUrl);

		// Subscribe to the selected symbol
		socket.emit('subscribe', symbol);

		// Listen for updates from the server
		socket.on('tickerUpdate', (data) => {
			// console.log('📡 Received Ticker Data:', data);
			setTicker(data.data);
		});

		// Clean up the connection when component unmounts
		return () => {
			socket.disconnect();
		};
	}, [symbol]);

	const contextValue: TickerContextValue = {
		ticker,
	};

	return (
		<TickerContext.Provider value={contextValue}>
			{children}
		</TickerContext.Provider>
	);
};
