function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 1;
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return Math.abs(a);
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a / gcd(a, b)) * b);
}

function gcdArray(arr) {
  return arr.reduce((acc, x) => gcd(acc, x));
}

function lcmArray(arr) {
  return arr.reduce((acc, x) => lcm(acc, x));
}

function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0) return false;
  const r = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= r; i += 2) if (n % i === 0) return false;
  return true;
}

function fibonacciSeries(n) {
  const out = [];
  if (n <= 0) return out;
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    out.push(a);
    const t = a + b;
    a = b;
    b = t;
  }
  return out;
}

module.exports = { gcd, lcm, gcdArray, lcmArray, isPrime, fibonacciSeries };
