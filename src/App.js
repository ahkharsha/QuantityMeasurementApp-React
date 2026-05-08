import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TypeSelector from './components/TypeSelector';
import ActionSelector from './components/ActionSelector';
import OperatorSelector from './components/OperatorSelector';
import ConversionForm from './components/ConversionForm';
import ResultDisplay from './components/ResultDisplay';
import HistoryList from './components/HistoryList';

import { getUnits, getConversion, saveHistory, getHistory } from './services/api';
import { applyConversion, evaluateExpression, compareValues } from './utils/conversion';
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

  // Load history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistoryData(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    fetchHistory();
  }, []);

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
      let resultVal, expression, resText, resUnit = '';

      const numFromVal = Number(fromVal);
      const numToVal = toVal === null || toVal === '' ? null : Number(toVal);

      if (action === "Conversion") {
        if (fromUnit === toUnit) {
          resultVal = numFromVal;
        } else {
          const conv = await getConversion(fromUnit, toUnit);
          resultVal = applyConversion(numFromVal, conv);
        }
        setToVal(resultVal); // Update the TO box
        expression = `${numFromVal} ${fromUnit} to ${toUnit}`;
        resText = resultVal;
        resUnit = toUnit;
      } else if (action === "Comparison") {
        if (numToVal === null) return;
        
        let normToVal;
        if (fromUnit === toUnit) {
          normToVal = numToVal;
        } else {
          const conv = await getConversion(toUnit, fromUnit);
          normToVal = applyConversion(numToVal, conv);
        }

        resultVal = compareValues(numFromVal, normToVal);
        
        let cmpWord = "EQUAL TO";
        if (resultVal === 1) cmpWord = "GREATER THAN";
        if (resultVal === -1) cmpWord = "LESS THAN";

        expression = `${numFromVal} ${fromUnit} ? ${numToVal} ${toUnit}`;
        resText = `${numFromVal} ${fromUnit} is ${cmpWord} ${numToVal} ${toUnit}`;
        resUnit = ""; // comparison text covers it
      } else { // Arithmetic
        if (numToVal === null) return;

        let normToVal;
        if (fromUnit === toUnit) {
          normToVal = numToVal;
        } else {
          const conv = await getConversion(toUnit, fromUnit);
          normToVal = applyConversion(numToVal, conv);
        }

        resultVal = evaluateExpression(numFromVal, normToVal, operator);
        expression = `${numFromVal} ${fromUnit} ${operator} ${numToVal} ${toUnit}`;
        resText = resultVal;
        resUnit = fromUnit;
      }

      setResultText(resText);
      setResultUnit(resUnit);

      const record = {
        type: type,
        action: action,
        expression: expression,
        result: action === "Comparison" ? (resText.includes("EQUAL") ? "EQUAL TO" : (resText.includes("GREATER") ? "GREATER THAN" : "LESS THAN")) : `${resText} ${resUnit}`.trim(),
        timestamp: new Date().toISOString()
      };

      await saveHistory(record);
      const updatedHistory = await getHistory();
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
