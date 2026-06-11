const USD_TO_FCFA = 655;

export const toFcfa = (usd) => Math.round(parseFloat(usd || 0) * USD_TO_FCFA);

export const formatFcfa = (usd) => `${toFcfa(usd).toLocaleString("fr-FR")} FCFA`;
