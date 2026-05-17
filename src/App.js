import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TypeSelector from './components/TypeSelector';
import ActionSelector from './components/ActionSelector';
import OperatorSelector from './components/OperatorSelector';
import ConversionForm from './components/ConversionForm';
import ResultDisplay from './components/ResultDisplay';
import HistoryList from './components/HistoryList';

import { getUnits, convertQuantity, compareQuantity, calculateQuantity, getHistory } from './services/api';
import './App.scss';

function App() {
  const [type, setType] = useState('Length');
  const [action, setAction] = useState('Conversion');
  const [operator, setOperator] = useState('+');
  
  const [units, setUnits] = useState([]);
  
  const [fromVal, setFromVal] = useState(null);
  const [fromUnit, setFromUnit] = useState('');
  const [toVal, setToVal] = useState(null);
  const [toUnit, setToUnit] = useState('');

  const [resultText, setResultText] = useState(null);
  const [resultUnit, setResultUnit] = useState('');
  
  const [historyData, setHistoryData] = useState([]);

  // Load history on mount or when type changes
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory(type);
        setHistoryData(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    fetchHistory();
  }, [type]);

  // Load units when type changes
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setFromUnit('');
        setToUnit('');
        setFromVal(null);
        setToVal(null);
        setResultText(null);
        setResultUnit('');

        const unitsData = await getUnits(type);
        setUnits(unitsData);
      } catch (err) {
        console.error("Failed to load units:", err);
        setResultText("Server unavailable");
        setResultUnit('');
      }
    };
    fetchUnits();
  }, [type]);

  // Debounced calculate
  useEffect(() => {
    const timer = setTimeout(() => {
      calculate();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromVal, toVal, fromUnit, toUnit, action, operator]);

  const calculate = async () => {
    if (fromVal === null || fromVal === undefined || fromVal === '') return;
    if (!fromUnit || !toUnit) return;

    try {
      let resText, resUnit = '';

      if (action === "Conversion") {
        const data = await convertQuantity(fromVal, fromUnit, toUnit, type);
        setToVal(data.resultValue); // Update the TO box
        resText = data.resultValue;
        resUnit = data.resultUnit;
      } else if (action === "Comparison") {
        if (toVal === null || toVal === '') return;
        const data = await compareQuantity(fromVal, fromUnit, toVal, toUnit, type);
        let cmpWord = data.resultString === "Equal" ? "EQUAL TO" : "NOT EQUAL TO";
        resText = `${fromVal} ${fromUnit} is ${cmpWord} ${toVal} ${toUnit}`;
        resUnit = ""; // comparison text covers it
      } else { // Arithmetic
        if (toVal === null || toVal === '') return;
        const data = await calculateQuantity(fromVal, fromUnit, toVal, toUnit, type, operator);
        resText = data.resultValue;
        resUnit = data.resultUnit;
      }

      setResultText(resText);
      setResultUnit(resUnit);

      // Reload history from backend
      const updatedHistory = await getHistory(type);
      setHistoryData(updatedHistory);

    } catch (e) {
      setResultText("Error: " + e.message);
      setResultUnit('');
    }
  };

  const handleActionSelect = (newAction) => {
    setAction(newAction);
    setFromVal(null);
    setToVal(null);
    setResultText(null);
    setResultUnit('');
    setOperator('+');
  };

  return (
    <>
      <Header />
      <div className="container pb-5">
        <TypeSelector 
          selectedType={type} 
          onTypeSelect={setType} 
        />
        
        <ActionSelector 
          selectedAction={action} 
          onActionSelect={handleActionSelect} 
        />

        <OperatorSelector 
          isVisible={action === 'Arithmetic'} 
          selectedOperator={operator} 
          onOperatorSelect={setOperator} 
        />

        <ConversionForm 
          units={units}
          action={action}
          fromVal={fromVal}
          onFromValChange={setFromVal}
          fromUnit={fromUnit}
          onFromUnitChange={setFromUnit}
          toVal={toVal}
          onToValChange={setToVal}
          toUnit={toUnit}
          onToUnitChange={setToUnit}
          leftLabel={action === 'Conversion' ? 'FROM' : 'Value 1'}
          rightLabel={action === 'Conversion' ? 'TO' : 'Value 2'}
        />

        <ResultDisplay 
          value={resultText} 
          unitSymbol={resultUnit} 
        />

        <HistoryList records={historyData} />
      </div>
    </>
  );
}

export default App;
