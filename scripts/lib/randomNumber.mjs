/**
 * @typedef RandomNumberOptions
 * @property {number} precision
 */

/**
 * Generate a random number between two numbers
 * @param {number} [floor] Generator floor
 * @param {number} [ceil] Generator ceiling
 * @param {RandomNumberOptions} [opts]
 * @returns {number}
 */
export const randomNumber = (floor = 0, ceil = 1, opts = { precision: 2 }) => {
  const n = Math.random() * (ceil - floor) + floor
  return Number(n.toFixed(opts.precision))
}
