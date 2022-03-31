export const fmtNumber = (n: number): string => {
  const parts = n.toString().split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")
  return parts.join(",")
}
