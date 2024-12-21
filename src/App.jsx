import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Precise currency conversion rates (updated periodically)
const CURRENCY_RATES = {
  USD: 1,
  UAH: 38.92, // As of December 2024
  EUR: 0.92,
  GBP: 0.79,
  RUB: 90.50
};

const App = () => {
  console.log('App component rendering');
  const [skinportPrice, setSkinportPrice] = useState('');
  const [steamPrice, setSteamPrice] = useState('');
  const [currency, setCurrency] = useState('UAH');
  const [calculatedProfit, setCalculatedProfit] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const convertToUSD = (amount, fromCurrency) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    return numAmount / CURRENCY_RATES[fromCurrency];
  };

  const convertFromUSD = (amount, toCurrency) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    return (numAmount * CURRENCY_RATES[toCurrency]).toFixed(2);
  };

  const calculateProfit = () => {
    const skinportPriceUSD = parseFloat(skinportPrice);
    const steamPriceInSelectedCurrency = parseFloat(steamPrice);
    
    if (isNaN(skinportPriceUSD) || isNaN(steamPriceInSelectedCurrency)) {
      alert('Please enter valid prices');
      return;
    }

    const steamPriceUSD = convertToUSD(steamPriceInSelectedCurrency, currency);
    const steamFeeRate = 0.13;

    const steamProceedsBeforeFee = steamPriceUSD;
    const steamProceedsAfterFee = steamPriceUSD * (1 - steamFeeRate);
    const instantSaleProfit = steamProceedsAfterFee - skinportPriceUSD;
    const instantSaleProfitPercentage = (instantSaleProfit / skinportPriceUSD) * 100;

    setCalculatedProfit({
      skinportPriceUSD,
      steamPriceUSD,
      steamProceeds: {
        beforeFee: steamProceedsBeforeFee.toFixed(2),
        afterFee: steamProceedsAfterFee.toFixed(2)
      },
      instantSale: {
        profitUSD: instantSaleProfit.toFixed(2),
        profitInSelectedCurrency: convertFromUSD(instantSaleProfit, currency),
        profitPercentage: instantSaleProfitPercentage.toFixed(2)
      }
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-100 to-gray-200'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700 shadow-2xl' 
            : 'bg-white border border-gray-300 shadow-lg'
        } rounded-xl overflow-hidden`}
      >
        <div className={`p-6 flex items-center justify-between ${
          isDarkMode 
            ? 'bg-gray-900/50 border-b border-gray-700' 
            : 'bg-gray-100 border-b border-gray-300'
        }`}>
          <div className="flex items-center space-x-4">
            <DollarSign className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-black'}`} />
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Steam Market Calculator
            </h1>
          </div>
          <button 
            onClick={toggleDarkMode} 
            className="focus:outline-none hover:rotate-180 transition-transform duration-300"
          >
            {isDarkMode ? (
              <Sun className="text-white w-6 h-6 hover:text-yellow-300" />
            ) : (
              <Moon className="text-black w-6 h-6 hover:text-indigo-600" />
            )}
          </button>
        </div>

        <div className={`p-6 space-y-6 ${
          isDarkMode 
            ? 'bg-gray-800 border-t border-gray-700' 
            : 'bg-white border-t border-gray-300'
        }`}>
          <div>
            <label className={`flex items-center space-x-2 mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <CreditCard className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              <span>Currency</span>
            </label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className={`w-full p-3 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-blue-300'
              }`}
            >
              {Object.keys(CURRENCY_RATES).map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`flex items-center space-x-2 mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <DollarSign className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              <span>Skinport Price (USD)</span>
            </label>
            <input 
              type="number" 
              step="0.01"
              value={skinportPrice}
              onChange={(e) => setSkinportPrice(e.target.value)}
              className={`w-full p-3 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-blue-300'
              }`}
              placeholder="Enter Skinport price"
            />
          </div>

          <div>
            <label className={`flex items-center space-x-2 mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <RefreshCw className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              <span>Steam Market Price ({currency})</span>
            </label>
            <input 
              type="number" 
              step="0.01"
              value={steamPrice}
              onChange={(e) => setSteamPrice(e.target.value)}
              className={`w-full p-3 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-blue-300'
              }`}
              placeholder={`Enter Steam price in ${currency}`}
            />
          </div>

          <button 
            onClick={calculateProfit}
            className={`w-full p-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Calculate Profit
          </button>

          <AnimatePresence>
            {calculatedProfit && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 rounded-lg transition-all duration-300 border ${
                  parseFloat(calculatedProfit.instantSale.profitUSD) >= 0 
                    ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-200/50 border-green-300')
                    : (isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-200/50 border-red-300')
                }`}
              >
                <div className="flex items-center mb-4">
                  {parseFloat(calculatedProfit.instantSale.profitUSD) >= 0 ? (
                    <TrendingUp className={`w-6 h-6 mr-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                  ) : (
                    <TrendingDown className={`w-6 h-6 mr-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                  )}
                  <h3 className={`text-lg font-bold ${
                    parseFloat(calculatedProfit.instantSale.profitUSD) >= 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    Profit Details
                  </h3>
                </div>
                <div className={`space-y-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <div className="flex justify-between">
                    <span>Skinport Price:</span>
                    <span>USD {calculatedProfit.skinportPriceUSD}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Steam Market Price:</span>
                    <span>{currency} {convertFromUSD(calculatedProfit.steamPriceUSD, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Steam Sale Proceeds (Before Fee):</span>
                    <span>{currency} {convertFromUSD(calculatedProfit.steamProceeds.beforeFee, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Steam Sale Proceeds (After Fee):</span>
                    <span>{currency} {convertFromUSD(calculatedProfit.steamProceeds.afterFee, currency)}</span>
                  </div>
                  <div className={`flex justify-between font-bold ${
                    parseFloat(calculatedProfit.instantSale.profitUSD) >= 0 
                      ? 'text-green-300' 
                      : 'text-red-300'
                  }`}>
                    <span>Profit:</span>
                    <span>{currency} {calculatedProfit.instantSale.profitInSelectedCurrency}</span>
                  </div>
                  <div className={`flex justify-between ${
                    parseFloat(calculatedProfit.instantSale.profitUSD) >= 0 
                      ? 'text-green-300' 
                      : 'text-red-300'
                  }`}>
                    <span>Profit Percentage:</span>
                    <span>{calculatedProfit.instantSale.profitPercentage}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default App;