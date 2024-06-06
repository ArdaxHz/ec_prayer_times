import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                'cosmic': {
                    '50': '#faf5f9',
                    '100': '#f7ecf4',
                    '200': '#f1d9ec',
                    '300': '#e6bbdc',
                    '400': '#d690c4',
                    '500': '#c66eac',
                    '600': '#b15191',
                    '700': '#973f77',
                    '800': '#7e3663',
                    '900': '#71345a',
                    '950': '#3f1830',
                },
                'flax-smoke': {
                    '50': '#f3f4f1',
                    '100': '#e6e7e0',
                    '200': '#cfd2c4',
                    '300': '#b0b6a0',
                    '400': '#949b80',
                    '500': '#7a8266',
                    '600': '#5c634d',
                    '700': '#494e3d',
                    '800': '#3c4034',
                    '900': '#35382f',
                    '950': '#1b1d16',
                },
                'contessa': {
                    '50': '#fbf6f5',
                    '100': '#f6ecea',
                    '200': '#f0dcd8',
                    '300': '#e4c3bd',
                    '400': '#d3a096',
                    '500': '#ba7264',
                    '600': '#aa6558',
                    '700': '#8e5347',
                    '800': '#77463d',
                    '900': '#643f38',
                    '950': '#351e1a',
                },
            }
        }
    }
}
