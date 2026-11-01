// A bare name remains a city; explicit County wording selects the MLS county field.
export function countyFromLocation(value){
 const local=String(value||'').trim().replace(/,?\s+(?:TX|Texas)$/i,'').trim();
 const match=local.match(/^county\s*:\s*(.+)$/i)||local.match(/^(.+?)\s+county$/i);
 const county=(match?.[1]||'').trim();
 return /^[\p{L}][\p{L} .'-]{0,79}$/u.test(county)?county:'';
}
