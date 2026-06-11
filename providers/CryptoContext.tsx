'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CryptoContextType {
	currency: string;
	setCurrency: React.Dispatch<React.SetStateAction<string>>;
	symbol: string;
}

const Crypto = createContext<CryptoContextType | null>(null);

const CryptoContext = ({ children }: any) => {
	const [currency, setCurrency] = useState('USD');
	const [symbol, setSymbol] = useState('$');

	useEffect(() => {
		if (currency === 'INR') setSymbol('₹');
		else if (currency === 'USD') setSymbol('$');
	}, [currency]);

	return (
		<Crypto.Provider value={{ currency, setCurrency, symbol }}>
			{children}
		</Crypto.Provider>
	);
};

export default CryptoContext;

export const CryptoState = () => {
	const context = useContext(Crypto);
	if (!context) {
		throw new Error('CryptoState must be used within a CryptoContext');
	}
	return context;
};
