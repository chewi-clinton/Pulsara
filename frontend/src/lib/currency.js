import { useState, useEffect } from "react";

const USD_TO_FCFA = 655;

export const toFcfa = (usd) => Math.round(parseFloat(usd || 0) * USD_TO_FCFA);
export const formatFcfa = (usd) => `${toFcfa(usd).toLocaleString("fr-FR")} FCFA`;
export const formatUsd = (usd) => `$${parseFloat(usd || 0).toFixed(2)}`;

export function getCurrency() {
  if (typeof window === "undefined") return "FCFA";
  return localStorage.getItem("pulsara_currency") || "FCFA";
}

export function setCurrencyStore(currency) {
  localStorage.setItem("pulsara_currency", currency);
  window.dispatchEvent(new CustomEvent("currencychange", { detail: currency }));
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState("FCFA");

  useEffect(() => {
    setCurrencyState(getCurrency());
    const handler = (e) => setCurrencyState(e.detail);
    window.addEventListener("currencychange", handler);
    return () => window.removeEventListener("currencychange", handler);
  }, []);

  const toggle = (c) => {
    setCurrencyStore(c);
    setCurrencyState(c);
  };

  const format = (usd) =>
    currency === "USD" ? formatUsd(usd) : formatFcfa(usd);

  return { currency, setCurrency: toggle, format };
}
