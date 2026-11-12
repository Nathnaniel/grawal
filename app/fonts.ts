// Free stand-ins for the design's licensed fonts (Tusker Grotesk and Avenir), plus
// Inter and Switzer. Loaded once for the whole site; see globals.css for the stacks.
import { Inter, Nunito_Sans, Oswald } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter-face' });
const oswald = Oswald({ subsets: ['latin'], weight: ['500'], variable: '--font-oswald' });
const nunito = Nunito_Sans({ subsets: ['latin'], weight: ['400', '500', '800'], variable: '--font-nunito' });
const switzer = localFont({ src: './fonts/Switzer-Variable.woff2', variable: '--font-switzer-face', weight: '100 900' });

export const fontVariables = [inter.variable, oswald.variable, nunito.variable, switzer.variable].join(' ');
