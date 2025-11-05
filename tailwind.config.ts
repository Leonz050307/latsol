import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { 50:'#eef8ff',100:'#d9efff',200:'#b4dfff',300:'#85c7ff',400:'#58acff',500:'#2b89ff',600:'#1c6be6',700:'#164fbb',800:'#133f93',900:'#112f70'} } } },
  plugins: []
}
export default config
