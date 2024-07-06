import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                'eman-channel': {
                    '50': '#FFBDC4',
                    '100': '#FF94A4',
                    '200': '#FF6B86',
                    '300': '#FF426B',
                    '400': '#f7184f',
                    '500': '#d5073a',
                    '600': '#c80725',
                    '700': '#D10A43',
                    '800': '#AB0036',
                    '900': '#85002E',
                    '950': '#5E0024',
                },
            }
        }
    }
}
