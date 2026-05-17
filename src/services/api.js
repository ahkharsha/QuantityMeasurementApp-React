/**
 * Quantity Measurement App - API Module
 * Integrated with Spring Boot Backend!
 */

export const BASE_URL = "/api/v1/quantities";

// Spring Boot doesn't have a /units endpoint, so we hardcode the known units here.
export const UNITS_DATA = {
  Length: [
    { symbol: "FEET", label: "Feet" },
    { symbol: "INCHES", label: "Inches" },
    { symbol: "YARDS", label: "Yards" },
    { symbol: "CENTIMETERS", label: "Centimeters" }
  ],
  Volume: [
    { symbol: "LITRE", label: "Litre" },
    { symbol: "MILLILITER", label: "Milliliter" },
    { symbol: "GALLON", label: "Gallon" }
  ],
  Weight: [
    { symbol: "MILLIGRAM", label: "Milligram" },
    { symbol: "GRAM", label: "Gram" },
    { symbol: "KILOGRAM", label: "Kilogram" },
    { symbol: "POUND", label: "Pound" },
    { symbol: "TONNE", label: "Tonne" }
  ],
  Temperature: [
    { symbol: "CELSIUS", label: "Celsius" },
    { symbol: "FAHRENHEIT", label: "Fahrenheit" }
  ]
};

export async function getUnits(type) {
    return UNITS_DATA[type] || [];
}

export async function convertQuantity(value, fromUnit, toUnit, type) {
    const payload = {
        thisQuantityDTO: { value: Number(value), unit: fromUnit, measurementType: `${type}Unit` },
        thatQuantityDTO: { value: 0, unit: toUnit, measurementType: `${type}Unit` }
    };
    const res = await fetch(`${BASE_URL}/convert`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Conversion failed");
    return await res.json();
}

export async function compareQuantity(val1, unit1, val2, unit2, type) {
    const payload = {
        thisQuantityDTO: { value: Number(val1), unit: unit1, measurementType: `${type}Unit` },
        thatQuantityDTO: { value: Number(val2), unit: unit2, measurementType: `${type}Unit` }
    };
    const res = await fetch(`${BASE_URL}/compare`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Comparison failed");
    return await res.json();
}

export async function calculateQuantity(val1, unit1, val2, unit2, type, operator) {
    const payload = {
        thisQuantityDTO: { value: Number(val1), unit: unit1, measurementType: `${type}Unit` },
        thatQuantityDTO: { value: Number(val2), unit: unit2, measurementType: `${type}Unit` }
    };
    let endpoint = "";
    if (operator === "+") endpoint = "/add";
    if (operator === "-") endpoint = "/subtract";
    if (operator === "/" || operator === "÷") endpoint = "/divide";

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Calculation failed");
    return await res.json();
}

export async function getHistory(type) {
    try {
        const res = await fetch(`${BASE_URL}/history/type/${type}Unit`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.reverse(); // Newest first
    } catch(e) {
        return [];
    }
}
